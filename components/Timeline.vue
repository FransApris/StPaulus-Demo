<template>
  <div class="timeline">
    <div v-for="group in groupedItems" :key="group.date" class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-date">{{ group.date }}</div>
        <div class="timeline-events-grid">
          <div v-for="item in group.items" :key="item.id" class="timeline-event">
            <h3 class="timeline-title">
              <NuxtLink :to="item.link" class="hover:text-[#882f1d]">{{ item.title }}</NuxtLink>
            </h3>
            <p v-if="item.excerpt" class="timeline-excerpt">{{ item.excerpt }}</p>
            <span class="timeline-type">{{ item.type === 'news' ? 'Berita' : 'Agenda' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const groupedItems = computed(() => {
  const groups = {}
  props.items.forEach(item => {
    const date = formatDate(item.date)
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  })
  return Object.entries(groups).map(([date, items]) => ({ date, items }))
})
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #882f1d;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-marker {
  position: absolute;
  left: -22px;
  top: 5px;
  width: 12px;
  height: 12px;
  background: #882f1d;
  border-radius: 50%;
  border: 2px solid white;
}

.timeline-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.timeline-date {
  color: #882f1d;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.timeline-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.timeline-event {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 3px solid #882f1d;
}

.timeline-title {
  font-size: 1em;
  margin-bottom: 5px;
  color: #333;
}

.timeline-excerpt {
  color: #666;
  margin-bottom: 8px;
  line-height: 1;
  font-size: 0.5em;
}

.timeline-type {
  display: inline-block;
  background: #e5e7eb;
  color: #374151;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7em;
  font-weight: 500;
}

@media (max-width: 768px) {
  .timeline-events-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .timeline-events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .timeline-events-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
