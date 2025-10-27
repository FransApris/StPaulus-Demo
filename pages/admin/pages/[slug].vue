<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isNew ? 'Tambah Halaman Baru' : 'Edit Halaman' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ isNew ? 'Buat halaman statis baru untuk website' : 'Edit konten halaman statis' }}
          </p>
        </div>
        <div class="flex space-x-3">
          <NuxtLink
            to="/admin/pages"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Kembali ke Daftar
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4">
        <form @submit.prevent="savePage" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Judul Halaman *
            </label>
            <input
              v-model="pageForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Masukkan judul halaman"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              v-model="pageForm.slug"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="url-friendly-slug"
            />
            <p class="text-sm text-gray-500 mt-1">
              URL halaman akan menjadi: /pages/{{ pageForm.slug }}
            </p>
          </div>

          <!-- Content with TipTap Editor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Konten Halaman
            </label>
            <div class="border border-gray-300 rounded-md shadow-sm focus-within:ring-red-500 focus-within:border-red-500">
              <!-- Toolbar -->
              <div class="border-b border-gray-200 p-2 flex gap-2 flex-wrap">
                <button
                  @click="editor?.chain().focus().toggleBold().run()"
                  :class="editor?.isActive('bold') ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  @click="editor?.chain().focus().toggleItalic().run()"
                  :class="editor?.isActive('italic') ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <button
                  @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
                  :class="editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                  :class="editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  @click="editor?.chain().focus().toggleBulletList().run()"
                  :class="editor?.isActive('bulletList') ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  @click="editor?.chain().focus().toggleOrderedList().run()"
                  :class="editor?.isActive('orderedList') ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Numbered List"
                >
                  1. List
                </button>
                <button
                  @click="editor?.chain().focus().toggleBlockquote().run()"
                  :class="editor?.isActive('blockquote') ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Quote"
                >
                  "
                </button>
                <button
                  @click="addLink"
                  :class="editor?.isActive('link') ? 'bg-gray-200' : ''"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Add Link"
                >
                  🔗
                </button>
                <button
                  @click="addImage"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Add Image"
                >
                  🖼️
                </button>
                <button
                  @click="editor?.chain().focus().undo().run()"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Undo"
                >
                  ↶
                </button>
                <button
                  @click="editor?.chain().focus().redo().run()"
                  class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  type="button"
                  title="Redo"
                >
                  ↷
                </button>
              </div>
              <!-- Editor Content -->
              <EditorContent :editor="editor" class="p-4 min-h-[400px] prose max-w-none" />
            </div>
          </div>

          <!-- Publish Status -->
          <div>
            <label class="flex items-center">
              <input
                v-model="pageForm.is_published"
                type="checkbox"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Publikasikan halaman</span>
            </label>
            <p class="text-sm text-gray-500 mt-1">
              Halaman yang dipublikasikan akan dapat diakses oleh publik
            </p>
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <NuxtLink
              to="/admin/pages"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Batal
            </NuxtLink>
            <button
              type="submit"
              :disabled="saving"
              class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Halaman' }}
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

const route = useRoute()
const router = useRouter()

// Reactive data
const pageForm = ref({
  title: '',
  slug: '',
  content: '',
  is_published: false
})

const saving = ref(false)
const isNew = computed(() => route.params.slug === 'new')

// TipTap Editor
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
    pageForm.value.content = editor.getHTML()
  },
})

// Auto-generate slug from title
watch(() => pageForm.value.title, (newTitle) => {
  if (newTitle && isNew.value) { // Only auto-generate for new pages
    pageForm.value.slug = $createSlug(newTitle)
  }
})

// Fetch page data if editing
const fetchPage = async () => {
  if (isNew.value) return

  try {
    const response = await $fetch(`/api/admin/pages/${route.params.slug}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })

    pageForm.value = {
      title: response.title,
      slug: response.slug,
      content: response.content || '',
      is_published: response.is_published === 1
    }

    // Set editor content
    nextTick(() => {
      editor.value?.commands.setContent(response.content || '')
    })
  } catch (error) {
    console.error('Failed to fetch page:', error)
    alert('Gagal memuat data halaman')
    navigateTo('/admin/pages')
  }
}

// Save page
const savePage = async () => {
  saving.value = true
  try {
    const url = isNew.value
      ? '/api/admin/pages'
      : `/api/admin/pages/${route.params.slug}`
    const method = isNew.value ? 'POST' : 'PUT'

    const payload = {
      ...pageForm.value,
      is_published: pageForm.value.is_published ? 1 : 0
    }

    const response = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    alert(isNew.value ? 'Halaman berhasil dibuat' : 'Halaman berhasil diperbarui')

    // Redirect to the page list or edit page with new slug
    if (isNew.value) {
      navigateTo('/admin/pages')
    } else if (response.slug && response.slug !== route.params.slug) {
      // Slug changed, redirect to new URL
      navigateTo(`/admin/pages/${response.slug}`)
    }
  } catch (error) {
    console.error('Failed to save page:', error)
    alert('Gagal menyimpan halaman')
  } finally {
    saving.value = false
  }
}

// TipTap functions
const addLink = () => {
  const url = window.prompt('Masukkan URL:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

const addImage = () => {
  const url = window.prompt('Masukkan URL gambar:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = sessionStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await fetchPage()
})

// Cleanup editor on unmount
onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose :deep(h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.prose :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.83em 0;
}

.prose :deep(p) {
  margin: 1em 0;
}

.prose :deep(ul) {
  padding-left: 1.5em;
}

.prose :deep(ol) {
  padding-left: 1.5em;
}

.prose :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
}
</style>
