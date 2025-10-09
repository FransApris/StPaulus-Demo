import { allQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  // Add authentication check
  requireAuth(event)

  try {
    // Get article count from database
    const articlesResult = allQuery('SELECT COUNT(*) as count FROM articles', [])
    const articles = (articlesResult[0] as any)?.count || 0

    // Get news count from database
    const newsResult = allQuery('SELECT COUNT(*) as count FROM news', [])
    const news = (newsResult[0] as any)?.count || 0

    // Get albums and photos count from filesystem (matching gallery API)
    let albums = 0
    let photos = 0

    try {
      const albumsBaseDir = 'public/images/album'
      const albumFolders = await readdir(albumsBaseDir)

      for (const folderName of albumFolders) {
        const albumPath = join(albumsBaseDir, folderName)
        const itemStat = await stat(albumPath)

        if (itemStat.isDirectory()) {
          albums++

          // Count photos in this album
          const photoFiles = await readdir(albumPath)
          const imageFiles = photoFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          photos += imageFiles.length
        }
      }
    } catch (error) {
      console.warn('Could not read gallery directory for stats:', error)
      // Continue with 0 values if directory doesn't exist
    }

    return {
      articles: parseInt(articles),
      news: parseInt(news),
      albums,
      photos
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics'
    })
  }
})
