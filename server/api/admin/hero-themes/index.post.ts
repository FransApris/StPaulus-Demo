import { runQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'
import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_hero_themes')(event)

  const body = await readMultipartFormData(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No form data provided'
    })
  }

  // Extract form fields
  const name = body.find(item => item.name === 'name')?.data?.toString()?.trim()
  const imageFile = body.find(item => item.name === 'image')

  if (!name || !imageFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and image are required'
    })
  }

  // Validate name length
  if (name.length < 2 || name.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name must be between 2 and 100 characters'
    })
  }

  // Validate image type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(imageFile.type || '')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid image type. Only JPEG, PNG, and WebP are allowed'
    })
  }

  // Validate image size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (imageFile.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image size too large. Maximum size is 5MB'
    })
  }

  // Generate unique filename
  const extension = path.extname(imageFile.filename || 'image.jpg')
  const filename = `hero-theme-${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'themes')

  // Ensure upload directory exists
  try {
    await fs.mkdir(uploadDir, { recursive: true })
  } catch (error) {
    console.error('Error creating upload directory:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create upload directory'
    })
  }

  const filePath = path.join(uploadDir, filename)
  const imagePath = `/images/themes/${filename}`

  try {
    // Save file
    await fs.writeFile(filePath, imageFile.data)

    // Insert theme into database
    const result = runQuery(`
      INSERT INTO hero_themes (name, image_path, is_active)
      VALUES (?, ?, ?)
    `, [name, imagePath, 0])

    return {
      success: true,
      message: 'Theme created successfully',
      data: {
        id: result.lastInsertRowid,
        name,
        image_path: imagePath,
        is_active: false
      }
    }
  } catch (error) {
    console.error('Error creating theme:', error)

    // Clean up uploaded file if database insert failed
    try {
      await fs.unlink(filePath)
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError)
    }

    // Check for specific database errors
    if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string' && (error as any).message.includes('UNIQUE constraint failed')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A theme with this name already exists'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create theme'
    })
  }
})
