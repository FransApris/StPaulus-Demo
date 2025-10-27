<template>
  <!-- Add News Button -->
  <div class="mb-6">
    <button
      @click="showAddModal = true"
      class="bg-[#882f1d] hover:bg-[#a55e1f] text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Tambah Berita
    </button>
  </div>

  <!-- News List -->
      <div class="px-4 py-6 sm:px-0">
        <!-- News List -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Daftar Berita</h3>
              <div class="flex space-x-2">
                <select
                  v-model="filterStatus"
                  @change="fetchNews"
                  class="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Semua Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
              <p class="mt-2 text-sm text-gray-500">Memuat berita...</p>
            </div>

            <div v-else-if="news.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada berita</h3>
              <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat berita pertama Anda.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="newsItem in news"
                :key="newsItem.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-gray-900">{{ newsItem.title }}</h4>
                    <p class="text-sm text-gray-500 mt-1">{{ newsItem.excerpt || 'Tidak ada ringkasan' }}</p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Penulis: {{ newsItem.author || 'Tidak diketahui' }}</span>
                      <span>Dibuat: {{ formatDate(newsItem.created_at) }}</span>
                      <span
                        :class="getStatusClass(newsItem.status)"
                        class="px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {{ getStatusText(newsItem.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex space-x-2 ml-4">
                    <button
                      @click="editNews(newsItem)"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      @click="togglePublish(newsItem)"
                      :class="newsItem.status === 'published' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'"
                      class="text-white px-3 py-1 rounded text-sm"
                    >
                      {{ newsItem.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </button>
                    <button
                      @click="deleteNews(newsItem)"
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Add/Edit News Modal -->
    <div v-if="showAddModal || editingNews" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingNews ? 'Edit Berita' : 'Tambah Berita Baru' }}
          </h3>

          <form @submit.prevent="saveNews" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Judul</label>
              <input
                v-model="newsForm.title"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Slug</label>
              <input
                v-model="newsForm.slug"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Ringkasan</label>
              <textarea
                v-model="newsForm.excerpt"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Konten</label>
              <div class="mt-1 border border-gray-300 rounded-md shadow-sm focus-within:ring-[#882f1d] focus-within:border-[#882f1d]">
                <div class="border-b border-gray-200 p-2 flex gap-2">
                  <button
                    @click="editor?.chain().focus().toggleBold().run()"
                    :class="editor?.isActive('bold') ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    @click="editor?.chain().focus().toggleItalic().run()"
                    :class="editor?.isActive('italic') ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    <em>I</em>
                  </button>
                  <button
                    @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    H1
                  </button>
                  <button
                    @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    H2
                  </button>
                  <button
                    @click="editor?.chain().focus().toggleBulletList().run()"
                    :class="editor?.isActive('bulletList') ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    • List
                  </button>
                  <button
                    @click="editor?.chain().focus().toggleOrderedList().run()"
                    :class="editor?.isActive('orderedList') ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    1. List
                  </button>
                  <button
                    @click="editor?.chain().focus().toggleBlockquote().run()"
                    :class="editor?.isActive('blockquote') ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    "
                  </button>
                  <button
                    @click="editor?.chain().focus().undo().run()"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    ↶
                  </button>
                  <button
                    @click="editor?.chain().focus().redo().run()"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    ↷
                  </button>
                  <button
                    @click="addLink"
                    :class="editor?.isActive('link') ? 'bg-gray-200' : ''"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    🔗
                  </button>
                  <button
                    @click="addImage"
                    class="px-2 py-1 border rounded text-sm"
                  >
                    🖼️
                  </button>

                </div>
                <EditorContent :editor="editor" class="p-3 min-h-[200px] prose max-w-none" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Penulis</label>
              <input
                v-model="newsForm.author"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Kategori</label>
              <div class="mt-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                <div
                  v-for="category in allCategories"
                  :key="category.id"
                  class="flex items-center"
                >
                  <input
                    :id="`category-${category.id}`"
                    v-model="newsForm.category_ids"
                    :value="category.id"
                    type="checkbox"
                    class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded"
                  />
                  <label
                    :for="`category-${category.id}`"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    {{ category.name }}
                  </label>
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-500">Pilih satu atau lebih kategori untuk berita ini</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                v-model="newsForm.status"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="bg-[#882f1d] hover:bg-[#a55e1f] text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
const news = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const editingNews = ref(null)
const saving = ref(false)
const filterStatus = ref('')

const newsForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  status: 'draft',
  category_ids: []
})

const allCategories = ref([])

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    Image,
  ],
  onUpdate: ({ editor }) => {
    newsForm.value.content = editor.getHTML()
  },
})

const handleLogout = () => {
  sessionStorage.removeItem('admin_token')
  navigateTo('/admin/login')
}

// Fetch news
const fetchNews = async () => {
  loading.value = true
  try {
    const params = filterStatus.value ? `?status=${filterStatus.value}` : ''
    const response = await $fetch(`/api/admin/news${params}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    news.value = response
  } catch (error) {
    console.error('Failed to fetch news:', error)
    alert('Gagal memuat berita')
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/admin/article-categories', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    // Flatten categories for checkbox selection
    const flattenCategories = (cats) => {
      let result = []
      cats.forEach(cat => {
        result.push({ id: cat.id, name: cat.name })
        if (cat.children) {
          result = result.concat(flattenCategories(cat.children))
        }
      })
      return result
    }
    allCategories.value = flattenCategories(response)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Save news
const saveNews = async () => {
  saving.value = true
  try {
    const url = editingNews.value
      ? `/api/admin/news/${editingNews.value.id}`
      : '/api/admin/news'
    const method = editingNews.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: newsForm.value
    })

    closeModal()
    await fetchNews()
    alert(editingNews.value ? 'Berita berhasil diperbarui' : 'Berita berhasil ditambahkan')
  } catch (error) {
    console.error('Failed to save news:', error)
    alert('Gagal menyimpan berita')
  } finally {
    saving.value = false
  }
}

// Edit news
const editNews = (newsItem) => {
  editingNews.value = newsItem
  newsForm.value = {
    title: newsItem.title,
    slug: newsItem.slug,
    excerpt: newsItem.excerpt || '',
    content: newsItem.content,
    author: newsItem.author || '',
    status: newsItem.status,
    category_ids: newsItem.categories ? newsItem.categories.map(cat => cat.id) : []
  }
  nextTick(() => {
    editor.value?.commands.setContent(newsItem.content)
  })
}

// Toggle publish status
const togglePublish = async (newsItem) => {
  try {
    const newStatus = newsItem.status === 'published' ? 'draft' : 'published'
    await $fetch(`/api/admin/news/${newsItem.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: { ...newsItem, status: newStatus }
    })

    await fetchNews()
    alert(`Berita ${newStatus === 'published' ? 'dipublikasikan' : 'disimpan sebagai draft'}`)
  } catch (error) {
    console.error('Failed to toggle publish status:', error)
    alert('Gagal mengubah status berita')
  }
}

// Delete news
const deleteNews = async (newsItem) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus berita "${newsItem.title}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/news/${newsItem.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    await fetchNews()
    alert('Berita berhasil dihapus')
  } catch (error) {
    console.error('Failed to delete news:', error)
    alert('Gagal menghapus berita')
  }
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  editingNews.value = null
  newsForm.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    status: 'draft',
    category_ids: []
  }
  nextTick(() => {
    editor.value?.commands.setContent('')
  })
}

// TipTap functions
const addLink = () => {
  const url = window.prompt('Enter URL:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

const addImage = () => {
  const url = window.prompt('Enter image URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'published':
      return 'Published'
    case 'draft':
      return 'Draft'
    case 'archived':
      return 'Archived'
    default:
      return status
  }
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = sessionStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await Promise.all([fetchNews(), fetchCategories()])
})
</script>
