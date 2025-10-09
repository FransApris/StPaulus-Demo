import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  // Check authentication
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const token = authHeader.substring(7)
  try {
    // Verify token (simplified)
    if (!token) {
      throw new Error('Invalid token')
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  const body = await readBody(event)
  const { title, description, slug } = body

  if (!title || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and slug are required'
    })
  }

  // Validate slug (no special characters, only lowercase letters, numbers, hyphens)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug can only contain lowercase letters, numbers, and hyphens'
    })
  }

  const albumsBaseDir = 'public/images/album'
  const albumPath = join(albumsBaseDir, slug)

  try {
    // Check if album already exists
    try {
      await mkdir(albumPath, { recursive: true })
    } catch (error: any) {
      if (error.code === 'EEXIST') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Album with this slug already exists'
        })
      }
      throw error
    }

    // Create meta.json
    const metaData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      created_at: new Date().toISOString()
    }

    await writeFile(
      join(albumPath, 'meta.json'),
      JSON.stringify(metaData, null, 2),
      'utf-8'
    )

    return {
      success: true,
      album: {
        id: slug,
        title: metaData.title,
        description: metaData.description,
        thumbnail: null, // No photos yet
        photos: []
      }
    }
  } catch (error: any) {
    console.error('Error creating album:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not create album.',
    })
  }
})
