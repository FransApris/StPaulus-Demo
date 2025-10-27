import { runQuery, getQuery } from '../../../../database/db'
import { requirePermission } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_hero_themes')(event)

  const id = parseInt(event.context.params?.id || '0')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid theme ID'
    })
  }

  // Check if theme exists
  const theme = getQuery(`
    SELECT id, name FROM hero_themes WHERE id = ?
  `, [id]) as { id: number; name: string } | undefined

  if (!theme) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Theme not found'
    })
  }

  try {
    // First, deactivate all themes
    runQuery('UPDATE hero_themes SET is_active = FALSE')

    // Then activate the selected theme
    runQuery(`
      UPDATE hero_themes
      SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id])

    return {
      success: true,
      message: `Theme "${theme.name}" activated successfully`
    }
  } catch (error) {
    console.error('Error activating theme:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to activate theme'
    })
  }
})
