import { allQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const themes = allQuery(`
      SELECT id, name, image_path
      FROM hero_themes
      WHERE is_active = TRUE
      LIMIT 1
    `)

    if (!themes || themes.length === 0) {
      // Return default theme or null if no active theme
      return {
        success: true,
        data: null
      }
    }

    return {
      success: true,
      data: themes[0]
    }
  } catch (error) {
    console.error('Error fetching active hero theme:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
