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
            <p><strong>Nama:</strong> {{ user.full_name }}</p>
            <p><strong>Kategori:</strong> {{ user.user_category }}</p>
            <p><strong>Unit:</strong> {{ user.unit_name }}</p>
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
              <input
                v-model="bookingForm.start_time"
                type="datetime-local"
                class="w-full p-2 border rounded"
                required
              />
              <input
                v-model="bookingForm.end_time"
                type="datetime-local"
                class="w-full p-2 border rounded"
                required
              />
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
          <div>
            <h2 class="text-2xl font-semibold text-[#882f1d] mb-4">Pemesanan Saya</h2>
            <div v-if="myBookings.length === 0" class="text-gray-600">Belum ada pemesanan.</div>
            <div v-else class="space-y-4">
              <div v-for="booking in myBookings" :key="booking.id" class="p-4 border rounded">
                <h3 class="font-semibold">{{ booking.event_name }}</h3>
                <p>Ruangan: {{ booking.room_name }}</p>
                <p>Waktu: {{ new Date(booking.start_time).toLocaleString() }} - {{ new Date(booking.end_time).toLocaleString() }}</p>
                <p>Status: <span :class="getStatusClass(booking.status)">{{ booking.status }}</span></p>
                <p v-if="booking.rejection_reason" class="text-red-600">Alasan: {{ booking.rejection_reason }}</p>
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

const loginForm = ref({
  username: '',
  password: ''
})

const bookingForm = ref({
  event_name: '',
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
    user.value = response.user
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
      $fetch('/api/rooms'), // Assume we create this endpoint
      $fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    rooms.value = roomsRes
    myBookings.value = bookingsRes.filter(b => b.user_id === user.value.id)
  } catch (error) {
    console.error('Failed to load data', error)
  }
}

const selectRoom = (room) => {
  selectedRoom.value = room
}

const createBooking = async () => {
  bookingLoading.value = true
  bookingMessage.value = ''
  bookingError.value = ''
  try {
    const token = localStorage.getItem('auth_token')
    const response = await $fetch('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        ...bookingForm.value,
        room_id: selectedRoom.value.id
      }
    })
    bookingMessage.value = response.message
    selectedRoom.value = null
    bookingForm.value = { event_name: '', start_time: '', end_time: '' }
    await loadData()
  } catch (error) {
    bookingError.value = error.data?.statusMessage || 'Pemesanan gagal'
  } finally {
    bookingLoading.value = false
  }
}

const cancelBooking = () => {
  selectedRoom.value = null
  bookingForm.value = { event_name: '', start_time: '', end_time: '' }
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
</script>
