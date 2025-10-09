<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb (NEW) -->
        <Breadcrumb title="Kontak Kami" />

        <!-- Tombol Top -->
        <!-- <BackButton position="top" /> -->

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Kontak Kami</h1>
          <p class="text-xl text-gray-600">Hubungi paroki untuk informasi lebih lanjut atau pertanyaan rohani.</p>
        </div>

        <!-- Info Kontak (Unchanged) -->
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Alamat & Telepon</h2>
            <p>Jl. Juanda No. 123, Sidoarjo, Jawa Timur 61234</p>
            <p>Tel: (031) 123-4567 | Email: info@stpaulusjuanda.org</p>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Form Kontak</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
              <input
                v-model="form.name"
                type="text"
                placeholder="Nama"
                class="w-full p-2 border rounded"
                required
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full p-2 border rounded"
                required
              />
              <textarea
                v-model="form.message"
                placeholder="Pesan"
                class="w-full p-2 border rounded"
                rows="4"
                required
              ></textarea>
              <button
                type="submit"
                :disabled="loading"
                class="bg-[#882f1d] text-white px-6 py-2 rounded hover:bg-[#6b2416] disabled:opacity-50"
              >
                {{ loading ? 'Mengirim...' : 'Kirim' }}
              </button>
            </form>
            <p v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</p>
            <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Tombol Bottom -->
        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
const form = ref({
  name: '',
  email: '',
  message: ''
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const submitForm = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })

    successMessage.value = response.message
    form.value = { name: '', email: '', message: '' }
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || 'Terjadi kesalahan saat mengirim pesan'
  } finally {
    loading.value = false
  }
}
</script>
