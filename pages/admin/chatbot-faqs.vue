<template>
  <div class="space-y-6">
    <!-- Add/Edit FAQ Form -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">{{ editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru' }}</h2>
      <form @submit.prevent="saveFaq" class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
          <textarea
            v-model="faqForm.question"
            placeholder="Masukkan pertanyaan..."
            class="w-full border p-2 rounded resize-vertical min-h-[80px]"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
          <textarea
            v-model="faqForm.answer"
            placeholder="Masukkan jawaban..."
            class="w-full border p-2 rounded resize-vertical min-h-[120px]"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select v-model="faqForm.category" class="w-full border p-2 rounded">
              <option value="">Pilih Kategori</option>
              <option v-for="category in categories" :key="category.id" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Keywords (pisahkan dengan koma)</label>
            <input
              v-model="keywordsText"
              type="text"
              placeholder="misal: misa, jadwal, waktu"
              class="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              v-model="faqForm.is_active"
              type="checkbox"
              class="rounded border-gray-300 text-paulus-blue focus:ring-paulus-blue"
            />
            <span class="ml-2 text-sm text-gray-700">Aktif</span>
          </label>
        </div>

        <div class="flex space-x-2">
          <button
            type="submit"
            :disabled="loading"
            class="bg-paulus-blue text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Menyimpan...' : (editingFaq ? 'Update FAQ' : 'Tambah FAQ') }}
          </button>

          <button
            v-if="editingFaq"
            type="button"
            @click="cancelEdit"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </form>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- FAQs List -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Daftar FAQ</h2>
      <div v-if="faqs.length === 0" class="text-gray-500">Belum ada FAQ.</div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">Pertanyaan</th>
              <th class="px-4 py-2 text-left">Kategori</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Penggunaan</th>
              <th class="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faq in faqs" :key="faq.id" class="border-t">
              <td class="px-4 py-2 max-w-xs truncate" :title="faq.question">{{ faq.question }}</td>
              <td class="px-4 py-2">{{ getCategoryName(faq.category) || '-' }}</td>
              <td class="px-4 py-2">
                <span
                  :class="faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ faq.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-4 py-2">{{ faq.usage_count || 0 }}</td>
              <td class="px-4 py-2">
                <button @click="editFaq(faq)" class="text-blue-600 hover:underline mr-2">Edit</button>
                <button @click="deleteFaq(faq)" class="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { makeRequest } = useAdminApi()

const faqs = ref([])
const categories = ref([])
const faqForm = ref({
  question: '',
  answer: '',
  category: '',
  is_active: true
})
const keywordsText = ref('')
const editingFaq = ref(null)
const loading = ref(false)
const message = ref('')
const error = ref('')

// Load FAQs and Categories
const loadFaqs = async () => {
  try {
    faqs.value = await makeRequest('/api/admin/chatbot-faqs')
  } catch (err) {
    console.error('Failed to load FAQs', err)
  }
}

const loadCategories = async () => {
  try {
    categories.value = await makeRequest('/api/admin/chatbot-faq-categories')
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

onMounted(() => {
  loadFaqs()
  loadCategories()
})

const saveFaq = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    const keywords = keywordsText.value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)

    const formData = {
      ...faqForm.value,
      keywords: keywords.length > 0 ? keywords : undefined
    }

    if (editingFaq.value) {
      await makeRequest(`/api/admin/chatbot-faqs/${editingFaq.value.id}`, {
        method: 'PUT',
        body: formData
      })
      message.value = 'FAQ berhasil diperbarui'
    } else {
      await makeRequest('/api/admin/chatbot-faqs', {
        method: 'POST',
        body: formData
      })
      message.value = 'FAQ berhasil ditambahkan'
    }

    resetForm()
    await loadFaqs()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal menyimpan FAQ'
  } finally {
    loading.value = false
  }
}

const editFaq = (faq) => {
  editingFaq.value = faq
  faqForm.value = {
    question: faq.question,
    answer: faq.answer,
    category: faq.category || '',
    is_active: faq.is_active
  }
  keywordsText.value = faq.keywords ? JSON.parse(faq.keywords).join(', ') : ''
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  editingFaq.value = null
  faqForm.value = {
    question: '',
    answer: '',
    category: '',
    is_active: true
  }
  keywordsText.value = ''
}

const getCategoryName = (slug) => {
  const category = categories.value.find(cat => cat.slug === slug)
  return category ? category.name : slug
}

const deleteFaq = async (faq) => {
  if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return

  try {
    await makeRequest(`/api/admin/chatbot-faqs/${faq.id}`, {
      method: 'DELETE'
    })
    message.value = 'FAQ berhasil dihapus'
    await loadFaqs()
  } catch (err) {
    error.value = err.data?.statusMessage || 'Gagal menghapus FAQ'
  }
}
</script>
