<template>
  <!-- Main Content -->
  <div>
      <!-- Add Article Button -->
      <div class="mb-6">
        <button
          @click="showAddModal = true"
          class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Tambah Artikel
        </button>
      </div>

      <!-- Articles List -->
        <!-- Articles List -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Daftar Artikel</h3>
              <div class="text-sm text-gray-500">
                {{ articles.length }} artikel ditemukan
              </div>
            </div>

            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-500">Memuat artikel...</p>
            </div>

            <div v-else-if="articles.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada artikel</h3>
              <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat artikel pertama Anda.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="article in articles"
                :key="article.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-gray-900">{{ article.title }}</h4>
                    <p class="text-sm text-gray-500 mt-1">{{ article.excerpt || 'Tidak ada ringkasan' }}</p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Penulis: {{ article.author || 'Tidak diketahui' }}</span>
                      <span>Dibuat: {{ formatDate(article.created_at) }}</span>
                      <span
                        :class="getStatusClass(article.status)"
                        class="px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {{ getStatusText(article.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex space-x-2 ml-4">
                    <button
                      @click="editArticle(article)"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      @click="togglePublish(article)"
                      :class="article.status === 'published' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'"
                      class="text-white px-3 py-1 rounded text-sm"
                    >
                      {{ article.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </button>
                    <button
                      @click="deleteArticle(article)"
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

    <!-- Add/Edit Article Modal -->
    <div v-if="showAddModal || editingArticle" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingArticle ? 'Edit Artikel' : 'Tambah Artikel Baru' }}
          </h3>

          <form @submit.prevent="saveArticle" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Judul</label>
              <input
                v-model="articleForm.title"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Slug</label>
              <input
                v-model="articleForm.slug"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Ringkasan</label>
              <textarea
                v-model="articleForm.excerpt"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                v-model="articleForm.author"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                    v-model="articleForm.category_ids"
                    :value="category.id"
                    type="checkbox"
                    class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    :for="`category-${category.id}`"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    {{ category.name }}
                  </label>
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-500">Pilih satu atau lebih kategori untuk artikel ini</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                v-model="articleForm.status"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
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

// Import slug utility
const { $createSlug } = useNuxtApp()

const articles = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const editingArticle = ref(null)
const saving = ref(false)
const filterStatus = ref('')
const searchQuery = ref('')
const selectedArticles = ref([])

const articleForm = ref({
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
    articleForm.value.content = editor.getHTML()
  },
})

const editorConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'blockQuote',
    'undo',
    'redo'
  ],
  language: 'id'
}

// Auto-generate slug from title
watch(() => articleForm.value.title, (newTitle) => {
  if (newTitle && !editingArticle.value) { // Only auto-generate for new articles
    articleForm.value.slug = $createSlug(newTitle)
  }
})

const handleLogout = () => {
  sessionStorage.removeItem('admin_token')
  navigateTo('/admin/login')
}

// Fetch articles
const fetchArticles = async () => {
  loading.value = true
  try {
    const params = filterStatus.value ? `?status=${filterStatus.value}` : ''
    const response = await $fetch(`/api/admin/articles${params}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
    articles.value = response
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    alert('Gagal memuat artikel')
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

// Save article
const saveArticle = async () => {
  saving.value = true
  try {
    const url = editingArticle.value
      ? `/api/admin/articles/${editingArticle.value.id}`
      : '/api/admin/articles'
    const method = editingArticle.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: articleForm.value
    })

    closeModal()
    await fetchArticles()
    alert(editingArticle.value ? 'Artikel berhasil diperbarui' : 'Artikel berhasil ditambahkan')
  } catch (error) {
    console.error('Failed to save article:', error)
    alert('Gagal menyimpan artikel')
  } finally {
    saving.value = false
  }
}

// Edit article
const editArticle = (article) => {
  editingArticle.value = article
  articleForm.value = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: article.content,
    author: article.author || '',
    status: article.status,
    category_ids: article.categories ? article.categories.map(cat => cat.id) : []
  }
  nextTick(() => {
    editor.value?.commands.setContent(article.content)
  })
}

// Toggle publish status
const togglePublish = async (article) => {
  try {
    const newStatus = article.status === 'published' ? 'draft' : 'published'
    await $fetch(`/api/admin/articles/${article.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: { ...article, status: newStatus }
    })

    await fetchArticles()
    alert(`Artikel ${newStatus === 'published' ? 'dipublikasikan' : 'disimpan sebagai draft'}`)
  } catch (error) {
    console.error('Failed to toggle publish status:', error)
    alert('Gagal mengubah status artikel')
  }
}

// Delete article
const deleteArticle = async (article) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${article.title}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/articles/${article.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    await fetchArticles()
    alert('Artikel berhasil dihapus')
  } catch (error) {
    console.error('Failed to delete article:', error)
    alert('Gagal menghapus artikel')
  }
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  editingArticle.value = null
  articleForm.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    status: 'draft',
    category_ids: []
  }
  nextTick(() => {
    editor?.commands.setContent('')
  })
}

// TipTap functions
const addLink = () => {
  const url = window.prompt('Enter URL:')
  if (url) {
    editor?.chain().focus().setLink({ href: url }).run()
  }
}

const addImage = () => {
  const url = window.prompt('Enter image URL:')
  if (url) {
    editor?.chain().focus().setImage({ src: url }).run()
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

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchArticles()
  }, 500)
}

// Placeholder functions for bulk actions
const exportArticles = () => {
  alert('Fitur export akan segera hadir')
}

const selectAllArticles = () => {
  selectedArticles.value = articles.value.map(article => article.id)
}

const bulkPublish = async () => {
  if (selectedArticles.value.length === 0) return

  try {
    for (const id of selectedArticles.value) {
      await $fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        },
        body: { status: 'published' }
      })
    }
    selectedArticles.value = []
    await fetchArticles()
    alert('Artikel berhasil dipublikasikan')
  } catch (error) {
    console.error('Failed to bulk publish:', error)
    alert('Gagal mempublikasikan artikel')
  }
}

const bulkDelete = async () => {
  if (selectedArticles.value.length === 0) return

  if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedArticles.value.length} artikel?`)) {
    return
  }

  try {
    for (const id of selectedArticles.value) {
      await $fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
        }
      })
    }
    selectedArticles.value = []
    await fetchArticles()
    alert('Artikel berhasil dihapus')
  } catch (error) {
    console.error('Failed to bulk delete:', error)
    alert('Gagal menghapus artikel')
  }
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = sessionStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await Promise.all([fetchArticles(), fetchCategories()])
})
</script>
