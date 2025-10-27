<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <Breadcrumb title="Pemesanan Ruangan" />

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Pemesanan Ruangan</h1>
          <p class="text-xl text-gray-600">Pesan ruangan gereja untuk kegiatan Anda.</p>
        </div>

        <!-- Login Section -->
        <div v-if="!isLoggedIn" class="max-w-md mx-auto mb-12">
          <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Login</h2>
          <form @submit.prevent="login" class="space-y-4">
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="Username"
              class="w-full p-2 border rounded"
              required
            />
            <input
              v-model="loginForm.password"
              type="password"
              placeholder="Password"
              class="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              :disabled="loginLoading"
              class="bg-[#882f1d] text-white px-6 py-2 rounded hover:bg-[#6b2416] disabled:opacity-50"
            >
              {{ loginLoading ? 'Login...' : 'Login' }}
            </button>
          </form>
          <p v-if="loginError" class="mt-4 text-red-600">{{ loginError }}</p>
        </div>

        <!-- Booking Section -->
        <div v-else>
          <!-- User Info -->
          <div class="mb-8 p-4 bg-gray-100 rounded">
            <p><strong>Nama:</strong> {{ user?.full_name || 'Memuat...' }}</p>
            <p><strong>Kategori:</strong> {{ user?.user_category || 'Memuat...' }}</p>
            <p><strong>Unit:</strong> {{ user?.unit_name || 'Memuat...' }}</p>
            <button @click="logout" class="mt-2 text-red-600 hover:underline">Logout</button>
          </div>

          <!-- Available Rooms -->
          <div class="mb-8">
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Ruangan Tersedia</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="room in rooms" :key="room.id" class="p-4 border rounded">
                <h3 class="font-semibold">{{ room.name }}</h3>
                <p>Kapasitas: {{ room.capacity }}</p>
                <p>Lokasi: {{ room.location }}</p>
                <p v-if="room.facilities">Fasilitas: {{ JSON.parse(room.facilities).join(', ') }}</p>
                <button @click="selectRoom(room)" class="mt-2 bg-[#882f1d] text-white px-4 py-2 rounded">Pesan</button>
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <div v-if="selectedRoom" class="mb-8">
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Pesan {{ selectedRoom.name }}</h2>
            <form @submit.prevent="createBooking" class="space-y-4">
              <input
                v-model="bookingForm.event_name"
                type="text"
                placeholder="Nama Acara"
                class="w-full p-2 border rounded"
                required
              />
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Acara</label>
                  <input
                    v-model="bookingForm.event_date"
                    type="date"
                    class="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
                  <input
                    v-model="bookingForm.start_time"
                    type="time"
                    class="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
                  <input
                    v-model="bookingForm.end_time"
                    type="time"
                    class="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                :disabled="bookingLoading"
                class="bg-[#882f1d] text-white px-6 py-2 rounded hover:bg-[#6b2416] disabled:opacity-50"
              >
                {{ bookingLoading ? 'Membuat Pemesanan...' : 'Pesan' }}
              </button>
              <button type="button" @click="cancelBooking" class="ml-2 text-gray-600">Batal</button>
            </form>
            <p v-if="bookingMessage" class="mt-4 text-green-600">{{ bookingMessage }}</p>
            <p v-if="bookingError" class="mt-4 text-red-600">{{ bookingError }}</p>
          </div>

          <!-- My Bookings -->
          <div class="mb-12">
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Pemesanan Saya</h2>
            <div v-if="myBookings.length === 0" class="text-gray-600">Belum ada pemesanan.</div>
            <div v-else class="space-y-4">
              <div v-for="booking in myBookings" :key="booking.id" class="p-4 border rounded">
                <h3 class="font-semibold">{{ booking.event_name }}</h3>
                <p>Ruangan: {{ booking.room_name }}</p>
                <p>Waktu: {{ formatBookingTime(booking.start_time, booking.end_time) }}</p>
                <p>Status: <span :class="getStatusClass(booking.status)">{{ getStatusText(booking.status, booking.start_time) }}</span></p>
                <p v-if="booking.rejection_reason" class="text-red-600">Alasan: {{ booking.rejection_reason }}</p>
              </div>
            </div>
          </div>

          <!-- Room Availability Table -->
          <div>
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Peta Pemesanan Ruangan</h2>

            <!-- Date Selector -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Tanggal</label>
              <input
                v-model="selectedDate"
                type="date"
                @change="loadRoomAvailability"
                class="p-2 border rounded"
              />
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-2 border-b text-left">Nama Ruangan</th>
                    <th class="px-4 py-2 border-b text-left">Kapasitas</th>
                    <th class="px-4 py-2 border-b text-left">Lokasi</th>
                    <th class="px-4 py-2 border-b text-left">Fasilitas</th>
                    <th class="px-4 py-2 border-b text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in roomAvailability" :key="room.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2 border-b font-medium">{{ room.name }}</td>
                    <td class="px-4 py-2 border-b">{{ room.capacity }} orang</td>
                    <td class="px-4 py-2 border-b">{{ room.location }}</td>
                    <td class="px-4 py-2 border-b">
                      <div v-if="room.facilities" class="text-sm">
                        {{ JSON.parse(room.facilities).join(', ') }}
                      </div>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-4 py-2 border-b">
                      <div class="flex flex-col">
                        <span :class="getAvailabilityStatusClass(room.status)" class="font-medium">
                          {{ room.status }}
                        </span>
                        <div v-if="room.statusDetails" class="text-sm text-gray-600 mt-1">
                          {{ room.statusDetails }}
                        </div>
                        <div v-if="room.bookings && room.bookings.length > 0" class="mt-2">
                          <div class="text-xs text-gray-500 mb-1">Jadwal Hari Ini:</div>
                          <div v-for="booking in room.bookings.slice(0, 3)" :key="booking.id" class="text-xs bg-gray-100 p-1 rounded mb-1">
                            <div class="font-medium">{{ booking.event_name }}</div>
                            <div class="text-gray-600">
                              {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
                              <span :class="getBookingStatusBadgeClass(booking.status)">
                                ({{ getBookingStatusText(booking.status) }})
                              </span>
                            </div>
                          </div>
                          <div v-if="room.bookings.length > 3" class="text-xs text-gray-500">
                            +{{ room.bookings.length - 3 }} lainnya...
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Legend -->
            <div class="mt-4 p-4 bg-gray-50 rounded">
              <h3 class="font-medium mb-2">Keterangan Status:</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>Tersedia</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Sedang Digunakan</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span>Sudah Dipesan</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  <span>Menunggu Persetujuan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BackButton position="bottom" />
      </div>
    </section>
  </div>
</template>

<script setup>
const isLoggedIn = ref(false)
const user = ref({})
const rooms = ref([])
const myBookings = ref([])
const selectedRoom = ref(null)
const roomAvailability = ref([])
const selectedDate = ref('')

const loginForm = ref({
  username: '',
  password: ''
})

const bookingForm = ref({
  event_name: '',
  event_date: '',
  start_time: '',
  end_time: ''
})

const loginLoading = ref(false)
const bookingLoading = ref(false)
const loginError = ref('')
const bookingMessage = ref('')
const bookingError = ref('')

// Check if logged in
onMounted(async () => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    try {
      const response = await $fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      user.value = response
      isLoggedIn.value = true
      await loadData()
    } catch {
      localStorage.removeItem('auth_token')
    }
  }

  // Set default date to today
  const today = new Date().toISOString().split('T')[0]
  selectedDate.value = today
})

const login = async () => {
  loginLoading.value = true
  loginError.value = ''
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: loginForm.value
    })
    localStorage.setItem('auth_token', response.token)
    // Fetch complete user details after login
    const userResponse = await $fetch('/api/me', {
      headers: { Authorization: `Bearer ${response.token}` }
    })
    user.value = userResponse
    isLoggedIn.value = true
    await loadData()
  } catch (error) {
    loginError.value = error.data?.statusMessage || 'Login gagal'
  } finally {
    loginLoading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('auth_token')
  isLoggedIn.value = false
  user.value = {}
  rooms.value = []
  myBookings.value = []
}

const loadData = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    const [roomsRes, bookingsRes] = await Promise.all([
      $fetch('/api/rooms'),
      $fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    rooms.value = roomsRes
    myBookings.value = bookingsRes.filter(b => b.user_id === user.value.id)
    await loadRoomAvailability()
  } catch (error) {
    console.error('Failed to load data', error)
  }
}

const loadRoomAvailability = async () => {
  try {
    const params = selectedDate.value ? `?date=${selectedDate.value}` : ''
    const availabilityRes = await $fetch(`/api/rooms-availability${params}`)
    roomAvailability.value = availabilityRes.rooms
  } catch (error) {
    console.error('Failed to load room availability', error)
  }
}

const selectRoom = (room) => {
  selectedRoom.value = room
}

const createBooking = async () => {
  bookingLoading.value = true
  bookingMessage.value = ''
  bookingError.value = ''

  // Frontend validation
  const eventDate = new Date(bookingForm.value.event_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (eventDate < today) {
    bookingError.value = 'Tanggal acara tidak boleh di masa lalu'
    bookingLoading.value = false
    return
  }

  if (bookingForm.value.start_time >= bookingForm.value.end_time) {
    bookingError.value = 'Waktu selesai harus lebih besar dari waktu mulai'
    bookingLoading.value = false
    return
  }

  try {
    // Combine date and time into DateTime objects
    const startDateTime = new Date(`${bookingForm.value.event_date}T${bookingForm.value.start_time}`)
    const endDateTime = new Date(`${bookingForm.value.event_date}T${bookingForm.value.end_time}`)

    const token = localStorage.getItem('auth_token')
    const response = await $fetch('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        event_name: bookingForm.value.event_name,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        room_id: selectedRoom.value.id
      }
    })
    bookingMessage.value = response.message
    selectedRoom.value = null
    bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '' }
    await loadData()
  } catch (error) {
    bookingError.value = error.data?.statusMessage || 'Pemesanan gagal'
  } finally {
    bookingLoading.value = false
  }
}

const cancelBooking = () => {
  selectedRoom.value = null
  bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '' }
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

const getStatusText = (status, startTime) => {
  const now = new Date()
  const eventStart = new Date(startTime)

  if (status === 'APPROVED' && eventStart < now) {
    return 'Selesai Digunakan'
  }

  switch (status) {
    case 'APPROVED': return 'Disetujui'
    case 'PENDING': return 'Menunggu Persetujuan'
    case 'REJECTED': return 'Ditolak'
    case 'CANCELLED': return 'Dibatalkan'
    default: return status
  }
}

const getAvailabilityStatusClass = (status) => {
  switch (status) {
    case 'Tersedia': return 'text-green-600'
    case 'Sedang Digunakan': return 'text-blue-600'
    case 'Sudah Dipesan': return 'text-yellow-600'
    case 'Menunggu Persetujuan': return 'text-orange-600'
    default: return 'text-gray-600'
  }
}

const getBookingStatusBadgeClass = (status) => {
  switch (status) {
    case 'APPROVED': return ' text-green-600'
    case 'PENDING': return ' text-orange-600'
    case 'REJECTED': return ' text-red-600'
    case 'CANCELLED': return ' text-gray-600'
    default: return ' text-gray-600'
  }
}

const getBookingStatusText = (status) => {
  switch (status) {
    case 'APPROVED': return 'Disetujui'
    case 'PENDING': return 'Menunggu'
    case 'REJECTED': return 'Ditolak'
    case 'CANCELLED': return 'Dibatalkan'
    default: return status
  }
}

const formatTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const formatBookingTime = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const dateStr = start.toLocaleDateString('id-ID', options)
  const startTimeStr = start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const endTimeStr = end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return `${dateStr} (${startTimeStr} - ${endTimeStr})`
}
</script>
