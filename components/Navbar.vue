<template>
  <!-- Navbar Content -->
  <nav class="container mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between bg-[#882f1d]">
    <NuxtLink to="/" class="flex items-center">
      <GerejaLogo :class="{ 'text-[#c58229]': !showHero, 'text-white': showHero }" />
    </NuxtLink>

    <!-- Desktop Links -->
    <ul class="hidden md:flex space-x-6">
      <li v-for="link in navLinks" :key="link.path || link.title" class="relative">
        <template v-if="link.dropdown">
          <!-- Dropdown Menu -->
          <button
            @click="toggleDropdown(link.title)"
            @mouseenter="showDropdown(link.title)"
            @mouseleave="hideDropdown(link.title)"
            :class="`font-medium transition-all duration-200 hover:scale-105 hover:border-b-2 hover:border-[#c58229] pb-1 ${props.showHero ? 'text-white hover:text-[#c58229]' : 'text-[#c58229] hover:text-[#a55e1f]'}`"
          >
            {{ link.title }}
            <svg class="inline-block w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-180': activeDropdown === link.title }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <!-- Dropdown Items -->
          <transition name="dropdown">
            <ul
              v-if="activeDropdown === link.title"
              @mouseenter="showDropdown(link.title)"
              @mouseleave="hideDropdown(link.title)"
              class="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
            >
              <li v-for="item in link.items" :key="item.path">
                <NuxtLink
                  :to="item.path"
                  @click="closeDropdown"
                  class="block px-4 py-2 text-gray-700 hover:bg-[#882f1d] hover:text-white transition-colors duration-200"
                >
                  {{ item.title }}
                </NuxtLink>
              </li>
            </ul>
          </transition>
        </template>
        <template v-else>
          <!-- Regular Link -->
          <NuxtLink
            :to="link.path"
            :class="getLinkClasses(link.path)"
          >
            {{ link.title }}
          </NuxtLink>
        </template>
      </li>
    </ul>

    <!-- Mobile Menu (Hamburger) -->
    <button @click="toggleMobileMenu" class="md:hidden p-2 text-[#c58229] hover:text-[#a55e1f] transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Mobile Menu Dropdown -->
    <transition name="dropdown">
      <div
        v-if="isMobileMenuOpen"
        ref="mobileMenu"
        class="md:hidden absolute top-full left-0 right-0 bg-[#882f1d] border-2 border-[#c58229] rounded-lg shadow-lg py-4"
        @click.stop
      >
        <ul class="flex flex-col space-y-2 px-4">
          <li v-for="link in navLinks" :key="link.path || link.title">
            <template v-if="link.dropdown">
              <!-- Mobile Dropdown -->
              <div class="py-2">
                <button
                  @click="toggleMobileDropdown(link.title)"
                  class="flex items-center justify-between w-full px-2 py-2 rounded transition-all duration-200 hover:border-b-2 hover:border-[#c58229] text-[#c58229] hover:text-[#a55e1f] hover:bg-[#c58229]/10"
                >
                  {{ link.title }}
                  <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': activeMobileDropdown === link.title }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <transition name="dropdown">
                  <ul v-if="activeMobileDropdown === link.title" class="ml-4 mt-2 space-y-1">
                    <li v-for="item in link.items" :key="item.path">
                      <NuxtLink
                        :to="item.path"
                        @click="isMobileMenuOpen = false"
                        class="block py-2 px-3 rounded transition-all duration-200 hover:border-b-2 hover:border-[#c58229] text-[#c58229] hover:text-[#a55e1f] hover:bg-[#c58229]/10"
                      >
                        {{ item.title }}
                      </NuxtLink>
                    </li>
                  </ul>
                </transition>
              </div>
            </template>
            <template v-else>
              <!-- Mobile Regular Link -->
              <NuxtLink
                :to="link.path"
                @click="isMobileMenuOpen = false"
                :class="`block py-2 px-2 rounded transition-all duration-200 hover:border-b-2 hover:border-[#c58229] ${route.path === link.path ? 'text-yellow-400 bg-[#c58229]/20 border-b-2 border-yellow-400' : 'text-[#c58229] hover:text-[#a55e1f] hover:bg-[#c58229]/10'}`"
              >
                {{ link.title }}
              </NuxtLink>
            </template>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script setup>
// Props
const props = defineProps({
  showHero: { type: Boolean, default: false }
})

// Composable
const route = useRoute()

// Local State
const isMobileMenuOpen = ref(false)
const mobileMenu = ref(null)
const activeDropdown = ref(null)
const dropdownTimeout = ref(null)
const activeMobileDropdown = ref(null)

// Nav Links
const navLinks = [
  { title: 'BERANDA', path: '/' },
  { title: 'JADWAL MISA', path: '/misa' },
  {
    title: 'PROFIL PAROKI',
    dropdown: true,
    items: [
      { title: 'Sejarah Paroki', path: '/sejarah' },
      { title: 'Kronik Gereja', path: '/kronik-gereja' },
      { title: 'Teritorial Paroki', path: '/teritorial-paroki' },
      { title: 'Romo yang Bertugas', path: '/romo-bertugas' },
      { title: 'Data Statistik Paroki', path: '/data-statistika-paroki' }
    ]
  },
  {
    title: 'KONTEN',
    dropdown: true,
    items: [
      { title: 'Artikel', path: '/artikel' },
      { title: 'Berita', path: '/berita' },
      { title: 'Galeri', path: '/galeri' }
    ]
  },
  { title: 'AGENDA PAROKI', path: '/agenda' },
  { title: 'PEMESANAN RUANGAN', path: '/booking' },
  { title: 'DOKUMEN PAROKI', path: '/dokumen-paroki' },
  { title: 'KONTAK', path: '/kontak' }
]

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleDropdown = (title) => {
  if (activeDropdown.value === title) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = title
  }
}

const showDropdown = (title) => {
  if (dropdownTimeout.value) {
    clearTimeout(dropdownTimeout.value)
  }
  activeDropdown.value = title
}

const hideDropdown = (title) => {
  dropdownTimeout.value = setTimeout(() => {
    if (activeDropdown.value === title) {
      activeDropdown.value = null
    }
  }, 150)
}

const closeDropdown = () => {
  activeDropdown.value = null
}

const toggleMobileDropdown = (title) => {
  if (activeMobileDropdown.value === title) {
    activeMobileDropdown.value = null
  } else {
    activeMobileDropdown.value = title
  }
}

// Event listeners for interactivity
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})

const handleClickOutside = (event) => {
  if (isMobileMenuOpen.value && mobileMenu.value && !mobileMenu.value.contains(event.target)) {
    closeMobileMenu()
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// Computed for link classes
const getLinkClasses = (linkPath) => {
  const baseClasses = "font-medium transition-all duration-200 hover:scale-105 hover:border-b-2 hover:border-[#c58229] pb-1"
  const isActive = route.path === linkPath
  const colorClasses = props.showHero
    ? (isActive ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-white hover:text-[#c58229]')
    : (isActive ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-[#c58229] hover:text-[#a55e1f]')
  return `${baseClasses} ${colorClasses}`
}
</script>

<style scoped>
/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
