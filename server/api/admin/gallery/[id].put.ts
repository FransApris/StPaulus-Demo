import { writeFile, access, readFile } from 'node:fs/promises'
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
    if (!token) {
      throw new Error('Invalid token')
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album ID is required'
    })
  }

  const body = await readBody(event)
  const { title, description } = body

  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title is required'
    })
  }

  const albumsBaseDir = 'public/images/album'
  const albumPath = join(albumsBaseDir, id)
  const metaPath = join(albumPath, 'meta.json')

  try {
    // Check if album exists
    try {
      await access(albumPath)
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    // Read existing meta.json
    let metaData
    try {
      const metaContent = await readFile(metaPath, 'utf-8')
      metaData = JSON.parse(metaContent)
    } catch (error) {
      // If meta.json doesn't exist, create default
      metaData = {
        title: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: '',
        created_at: new Date().toISOString()
      }
    }

    // Update metadata
    metaData.title = title.trim()
    metaData.description = description ? description.trim() : ''
    metaData.updated_at = new Date().toISOString()

    // Write updated meta.json
    await writeFile(metaPath, JSON.stringify(metaData, null, 2), 'utf-8')

    return {
      success: true,
      album: {
        id,
        title: metaData.title,
        description: metaData.description
      }
    }
  } catch (error: any) {
    console.error('Error updating album:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not update album.',
    })
  }
})
