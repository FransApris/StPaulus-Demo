<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-cinzel font-bold text-gray-900 mb-2">Kelola Kategori Konten</h1>
      <p class="text-gray-600">Kelola kategori untuk mengorganisir artikel dan berita paroki</p>
    </div>

    <!-- Add Category Button -->
    <div class="mb-6">
      <button
        @click="openModal()"
        class="bg-[#882f1d] text-white px-4 py-2 rounded-md hover:bg-[#6b2416] transition-colors duration-200 flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tambah Kategori
      </button>
    </div>

    <!-- Categories Tree -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
        <p class="mt-2 text-gray-600">Memuat kategori...</p>
      </div>

      <div v-else-if="categories.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada kategori</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat kategori pertama.</p>
      </div>

      <div v-else class="p-6">
        <div class="space-y-2">
          <CategoryTreeItem
            v-for="category in categories"
            :key="category.id"
            :category="category"
            @edit="openModal"
            @delete="deleteCategory"
          />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Kategori' : 'Tambah Kategori' }}
          </h3>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Kategori *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Kategori Induk
              </label>
              <select
                v-model="form.parent_id"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
              >
                <option :value="null">Tidak ada (Kategori Utama)</option>
                <option
                  v-for="category in allCategories"
                  :key="category.id"
                  :value="category.id"
                  :disabled="isEditing && category.id === editingId"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-[#882f1d] focus:ring-[#882f1d]"
                placeholder="Deskripsi kategori (opsional)"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-[#882f1d] border border-transparent rounded-md hover:bg-[#6b2416] disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const categories = ref([])
const allCategories = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  parent_id: null,
  description: ''
})

// Category Tree Item Component
const CategoryTreeItem = defineComponent({
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const expanded = ref(true)

    const toggleExpanded = () => {
      expanded.value = !expanded.value
    }

    return () => h('div', { class: 'border border-gray-200 rounded-lg' }, [
      // Category header
      h('div', { class: 'flex items-center justify-between p-4 bg-gray-50' }, [
        h('div', { class: 'flex items-center' }, [
          props.category.children && props.category.children.length > 0 ? h('button', {
            onClick: toggleExpanded,
            class: 'mr-2 text-gray-500 hover:text-gray-700'
          }, [
            h('svg', {
              class: `w-4 h-4 transition-transform ${expanded.value ? 'rotate-90' : ''}`,
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5l7 7-7 7' })
            ])
          ]) : h('div', { class: 'w-6' }),
          h('div', [
            h('div', { class: 'text-sm font-medium text-gray-900' }, props.category.name),
            h('div', { class: 'text-sm text-gray-500' }, props.category.slug)
          ])
        ]),
        h('div', { class: 'flex space-x-2' }, [
          h('button', {
            onClick: () => emit('edit', props.category),
            class: 'text-[#882f1d] hover:text-[#6b2416] text-sm'
          }, 'Edit'),
          h('button', {
            onClick: () => emit('delete', props.category.id),
            class: 'text-red-600 hover:text-red-900 text-sm'
          }, 'Hapus')
        ])
      ]),
      // Description
      props.category.description && h('div', { class: 'px-4 pb-2 text-sm text-gray-600' }, props.category.description),
      // Children
      props.category.children && props.category.children.length > 0 && expanded.value && h('div', { class: 'ml-6 space-y-2' }, [
        props.category.children.map(child => h(CategoryTreeItem, {
          category: child,
          onEdit: (cat) => emit('edit', cat),
          onDelete: (id) => emit('delete', id)
        }))
      ])
    ])
  }
})

// Fetch categories
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/article-categories', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    categories.value = response

    // Flatten for parent selection
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
    alert('Gagal memuat kategori')
  } finally {
    loading.value = false
  }
}

// Modal functions
const openModal = (category = null) => {
  if (category) {
    isEditing.value = true
    editingId.value = category.id
    form.value = {
      name: category.name,
      parent_id: category.parent_id,
      description: category.description || ''
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = {
      name: '',
      parent_id: null,
      description: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    name: '',
    parent_id: null,
    description: ''
  }
}

// Save category
const saveCategory = async () => {
  saving.value = true
  try {
    const url = isEditing.value
      ? `/api/admin/article-categories/${editingId.value}`
      : '/api/admin/article-categories'

    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: form.value,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })

    alert(isEditing.value ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan')
    closeModal()
    fetchCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
    alert(error.data?.message || 'Gagal menyimpan kategori')
  } finally {
    saving.value = false
  }
}

// Delete category
const deleteCategory = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    return
  }

  try {
    await $fetch(`/api/admin/article-categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })

    alert('Kategori berhasil dihapus')
    fetchCategories()
  } catch (error) {
    console.error('Failed to delete category:', error)
    alert(error.data?.message || 'Gagal menghapus kategori')
  }
}

// Initialize
onMounted(async () => {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    navigateTo('/admin/login')
    return
  }

  await fetchCategories()
})
</script>
