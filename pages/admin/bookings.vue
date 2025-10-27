<template>
  <div class="space-y-6">
        <!-- Filter -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Filter Pemesanan</h2>
          <select v-model="filterStatus" @change="loadBookings" class="border p-2 rounded">
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <!-- Bookings List -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Daftar Pemesanan</h2>
          <div v-if="bookings.length === 0" class="text-gray-500">Belum ada pemesanan.</div>
          <div v-else class="space-y-4">
            <div v-for="booking in bookings" :key="booking.id" class="border p-4 rounded">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold">{{ booking.event_name }}</h3>
                  <p>Ruangan: {{ booking.room_name }}</p>
                  <p>Pemesan: {{ booking.user_name }} ({{ booking.user_category }})</p>
                  <p>Unit: {{ booking.unit_name }}</p>
                  <p>Tanggal: {{ formatBookingDate(booking.start_time) }}</p>
                  <p>Waktu: {{ formatBookingTime(booking.start_time, booking.end_time) }}</p>
                  <p>Status: <span :class="getStatusClass(booking.status)">{{ booking.status }}</span></p>
                  <p v-if="booking.rejection_reason" class="text-red-600">Alasan: {{ booking.rejection_reason }}</p>
                </div>
                <div v-if="booking.status === 'PENDING'" class="space-x-2">
                  <button @click="approveBooking(booking)" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Setujui</button>
                  <button @click="rejectBooking(booking)" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Tolak</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reject Modal -->
        <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 class="text-lg font-semibold mb-4">Tolak Pemesanan</h3>
            <p class="mb-4">Alasan penolakan:</p>
            <textarea v-model="rejectionReason" class="w-full border p-2 rounded" rows="3" required></textarea>
            <div class="flex justify-end space-x-2 mt-4">
              <button @click="showRejectModal = false" class="px-4 py-2 text-gray-600">Batal</button>
              <button @click="confirmReject" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Tolak</button>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const bookings = ref([])
const filterStatus = ref('PENDING')
const showRejectModal = ref(false)
const rejectionReason = ref('')
const selectedBooking = ref(null)

const loadBookings = async () => {
  try {
    const params = filterStatus.value ? `?status=${filterStatus.value}` : ''
    bookings.value = await $fetch(`/api/admin/bookings${params}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load bookings', err)
  }
}

onMounted(() => {
  loadBookings()
})

const approveBooking = async (booking) => {
  try {
    await $fetch(`/api/bookings/${booking.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: { status: 'APPROVED' }
    })
    await loadBookings()
    alert('Pemesanan berhasil disetujui')
  } catch (err) {
    console.error('Error approving booking:', err)
    const errorMessage = err.data?.statusMessage || 'Gagal menyetujui pemesanan'
    alert(`Error: ${errorMessage}`)
  }
}

const rejectBooking = (booking) => {
  selectedBooking.value = booking
  showRejectModal.value = true
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!rejectionReason.value.trim()) {
    alert('Alasan penolakan diperlukan')
    return
  }
  try {
    await $fetch(`/api/bookings/${selectedBooking.value.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: { status: 'REJECTED', rejection_reason: rejectionReason.value }
    })
    showRejectModal.value = false
    selectedBooking.value = null
    rejectionReason.value = ''
    await loadBookings()
    alert('Pemesanan berhasil ditolak')
  } catch (err) {
    console.error('Error rejecting booking:', err)
    const errorMessage = err.data?.statusMessage || 'Gagal menolak pemesanan'
    alert(`Error: ${errorMessage}`)
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'APPROVED': return 'text-green-600'
    case 'PENDING': return 'text-yellow-600'
    case 'REJECTED': return 'text-red-600'
    case 'CANCELLED': return 'text-gray-600'
    default: return 'text-gray-600'
  }
}

const formatBookingDate = (dateTime) => {
  const date = new Date(dateTime)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatBookingTime = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const startTimeStr = start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const endTimeStr = end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return `${startTimeStr} - ${endTimeStr}`
}
</script>
