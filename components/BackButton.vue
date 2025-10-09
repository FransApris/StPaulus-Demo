<template>
  <div :class="alignmentClass">
    <NuxtLink
      :to="to"
      class="inline-flex items-center bg-[#882f1d] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#a55e1f] transition-colors shadow-md"
    >
      <!-- Icon: ← untuk top (back), → untuk bottom (home) -->
      <svg v-if="position === 'top'" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{{ text }}</span>
      <svg v-if="position === 'bottom'" class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </NuxtLink>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  to: { type: String, default: '/' },
  text: { type: String, default: 'Kembali ke Beranda' },
  position: { type: String, default: 'top', validator: (val) => ['top', 'bottom'].includes(val) }
})

// Computed: Alignment class (right untuk top, center untuk bottom)
const alignmentClass = computed(() => {
  return props.position === 'top' ? 'text-right mb-6' : 'text-center mt-8'
})
</script>

<style scoped>
/* No additional styles - All Tailwind */
</style>