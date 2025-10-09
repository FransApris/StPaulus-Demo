import { readdir, stat, readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Gunakan defineEventHandler untuk sementara, tanpa caching
export default defineEventHandler(async (event) => {
  // Path yang benar ke direktori berisi semua album
  const albumsBaseDir = 'public/images/album'

  try {
    const albumFolders = await readdir(albumsBaseDir)
    const albums = []

    for (const folderName of albumFolders) {
      const albumPath = join(albumsBaseDir, folderName)
      const itemStat = await stat(albumPath)

      if (itemStat.isDirectory()) {
        let title = folderName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        let description = 'Tidak ada deskripsi.'

        // Coba baca file meta.json untuk judul dan deskripsi yang lebih baik
        try {
          const metaPath = join(albumPath, 'meta.json');
          const metaContent = await readFile(metaPath, 'utf-8');
          const metaData = JSON.parse(metaContent);
          title = metaData.title || title;
          description = metaData.description || description;
        } catch (e) {
          // Jika meta.json tidak ada, gunakan judul dari nama folder
        }

        const photoFiles = await readdir(albumPath)
        const imageFiles = photoFiles
          .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          .sort()

        if (imageFiles.length > 0) {
          albums.push({
            id: folderName,
            title,
            description,
            // Ambil gambar pertama sebagai thumbnail
            thumbnail: `/images/album/${folderName}/${imageFiles[0]}`,
            photos: imageFiles.map((file, index) => ({
              id: `${folderName}-photo-${index + 1}`,
              // Ganti 'src' menjadi 'url' agar konsisten dengan PhotoGrid.vue
              url: `/images/album/${folderName}/${file}`,
              caption: file // caption bisa diambil dari metadata jika ada
            }))
          })
        }
      }
    }

    // Urutkan album berdasarkan nama folder secara descending (terbaru dulu)
    albums.sort((a, b) => b.id.localeCompare(a.id));

    return { albums }
  } catch (error) {
    console.error('Error reading gallery data:', error)
    // Kembalikan error agar frontend tahu ada masalah
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch gallery data.',
    })
  }
})
