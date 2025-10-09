  // tailwind.config.js
  module.exports = {
    content: ['./components/**/*.{vue,js,ts}', './pages/**/*.{vue,js,ts}', './layouts/**/*.{vue,js,ts}'],
    theme: {
      extend: {
        colors: {
          'paulus-blue': '#1E40AF',
        },
        fontFamily: {
          'cinzel': ['Cinzel', 'serif'],
          'lora': ['Lora', 'serif'],
        },
      },
    },
    plugins: [],
  }
  