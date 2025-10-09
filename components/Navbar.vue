<template>
  <!-- Navbar Content -->
  <nav class="container mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between bg-[#882f1d]">
    <NuxtLink to="/" class="flex items-center">
      <GerejaLogo :class="{ 'text-[#c58229]': !showHero, 'text-white': showHero }" />
    </NuxtLink>

    <!-- Desktop Links -->
    <ul class="hidden md:flex space-x-6">
      <li v-for="link in navLinks" :key="link.path">
        <NuxtLink
          :to="link.path"
          :class="getLinkClasses(link.path)"
        >
          {{ link.title }}
        </NuxtLink>
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
          <li v-for="link in navLinks" :key="link.path">
            <NuxtLink
              :to="link.path"
              @click="isMobileMenuOpen = false"
              :class="`block py-2 px-2 rounded transition-all duration-200 hover:border-b-2 hover:border-[#c58229] ${route.path === link.path ? 'text-yellow-400 bg-[#c58229]/20 border-b-2 border-yellow-400' : 'text-[#c58229] hover:text-[#a55e1f] hover:bg-[#c58229]/10'}`"
            >
              {{ link.title }}
            </NuxtLink>
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

// Nav Links
const navLinks = [
  { title: 'BERANDA', path: '/' },
  { title: 'JADWAL MISA', path: '/misa' },
  { title: 'SEJARAH', path: '/sejarah' },
  { title: 'GALERI FOTO', path: '/galeri' },
  { title: 'AGENDA PAROKI', path: '/agenda' },
  { title: 'PEMESANAN RUANGAN', path: '/booking' },
  { title: 'KONTAK', path: '/kontak' }
]

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
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
