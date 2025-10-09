<template>
  <div class="chat-widget fixed bottom-4 right-4 z-50">
    <!-- Chat Button -->
    <button
      @click="toggleChat"
      class="bg-paulus-blue hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
      :class="{ 'rotate-45': isOpen }"
    >
      <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border flex flex-col"
    >
      <!-- Header -->
      <div class="bg-paulus-blue text-white p-4 rounded-t-lg">
        <h3 class="font-semibold">Chatbot Gereja St. Paulus</h3>
        <p class="text-sm opacity-90">Tanya tentang misa, sakramen, dan paroki</p>
      </div>

      <!-- Messages -->
      <div class="flex-1 p-4 overflow-y-auto space-y-3" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'max-w-xs p-3 rounded-lg text-sm',
            message.sender === 'user'
              ? 'bg-paulus-blue text-white ml-auto'
              : 'bg-gray-100 text-gray-800'
          ]"
        >
          {{ message.text }}
        </div>
        <div v-if="isTyping" class="bg-gray-100 text-gray-800 p-3 rounded-lg text-sm max-w-xs">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ketik pesan Anda..."
            class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-paulus-blue"
            :disabled="isTyping"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim() || isTyping"
            class="bg-paulus-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const isOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.value.length === 0) {
    // Add welcome message
    messages.value.push({
      id: Date.now(),
      text: 'Selamat datang! Saya adalah chatbot Gereja St. Paulus. Saya dapat membantu Anda dengan informasi tentang jadwal misa, sakramen, dan kegiatan paroki. Apa yang ingin Anda tanyakan?',
      sender: 'bot'
    })
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    text: newMessage.value,
    sender: 'user'
  }

  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''
  isTyping.value = true

  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })

  try {
    const response = await $fetch('/api/chatbot/chat', {
      method: 'POST',
      body: { message: messageText }
    })

    messages.value.push({
      id: Date.now() + 1,
      text: response.response,
      sender: 'bot'
    })
  } catch (error) {
    messages.value.push({
      id: Date.now() + 1,
      text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
      sender: 'bot'
    })
  } finally {
    isTyping.value = false
    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
}

// Close chat when clicking outside (optional enhancement)
onMounted(() => {
  const handleClickOutside = (event) => {
    const chatWidget = event.target.closest('.chat-widget')
    if (!chatWidget && isOpen.value) {
      isOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.chat-widget {
  /* For click outside detection */
}
</style>
