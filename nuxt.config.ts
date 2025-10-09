export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  // Penambahan blok nitro untuk menghilangkan warning
  nitro: {
    compatibilityDate: '2025-10-04'
  },

  runtimeConfig: {
    // Variabel ini HANYA tersedia di sisi server (aman)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,

    // Variabel ini bisa diakses publik (di browser)
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
    },

    // Konfigurasi untuk auth endpoints
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
    },

    // OpenAI API configuration for chatbot
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    }
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            'paulus-blue': '#1E40AF',  // Blue gereja theme
          },
          fontFamily: {
            cinzel: ['Cinzel', 'serif'],
            lora: ['Lora', 'serif'],
          }
        }
      }
    }
  }
})
