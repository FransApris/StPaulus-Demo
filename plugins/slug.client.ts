import { createSlug } from '~/server/utils/slug'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      createSlug
    }
  }
})
