import { readdir, stat, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Album ID is required'
    })
  }

  try {
    const albumsBaseDir = 'public/images/album'
    const albumPath = join(albumsBaseDir, id)

    // Check if album directory exists
    try {
      await stat(albumPath)
    } catch (e) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    let title = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    let description = 'Tidak ada deskripsi.'

    // Try to read meta.json for better title and description
    try {
      const metaPath = join(albumPath, 'meta.json')
      const metaContent = await readFile(metaPath, 'utf-8')
      const metaData = JSON.parse(metaContent)
      title = metaData.title || title
      description = metaData.description || description
    } catch (e) {
      // If meta.json doesn't exist, use title from folder name
    }

    const photoFiles = await readdir(albumPath)
    const imageFiles = photoFiles
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort()

    if (imageFiles.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No photos found in album'
      })
    }

    const album = {
      id,
      title,
      description,
      thumbnail: `/images/album/${id}/${imageFiles[0]}`,
      photos: imageFiles.map((file, index) => ({
        id: `${id}-photo-${index + 1}`,
        url: `/images/album/${id}/${file}`,
        caption: file
      }))
    }

    return album
  } catch (error: any) {
    console.error('Error fetching album:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
