import db from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import { createSlug } from '../../../utils/slug'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  // Only super_admin and admin_sekretariat can create documents
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_documents')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can manage documents'
    })
  }

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No form data provided'
    })
  }

  const title = formData.find(f => f.name === 'title')?.data?.toString()
  const description = formData.find(f => f.name === 'description')?.data?.toString()
  const categoryId = formData.find(f => f.name === 'category_id')?.data?.toString()
  const file = formData.find(f => f.name === 'file')

  if (!title || !categoryId || !file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title, category, and file are required'
    })
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  if (file.type && !allowedTypes.includes(file.type)) {
    console.log('File type validation failed:', file.type)
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid file type: ${file.type}. Only PDF, DOC, DOCX, XLS, XLSX files are allowed`
    })
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File size too large. Maximum size is 10MB'
    })
  }

  // Check if category exists
  const categoryQuery = db.prepare(`SELECT id FROM document_categories WHERE id = ? AND is_active = 1`)
  const category = categoryQuery.get(categoryId)
  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category'
    })
  }

  // Generate unique filename
  const fileExt = path.extname(file.filename || 'file')
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`
  const uploadDir = path.join(process.cwd(), 'public/uploads/documents')
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, filename)

  try {
    // Save file
    fs.writeFileSync(filePath, file.data)

    // Save to database
    const insertQuery = db.prepare(`
      INSERT INTO documents (title, description, category_id, filename, original_filename, file_path, file_size, mime_type, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = insertQuery.run(title.trim(), description || null, categoryId, filename, file.filename || 'unknown', `/uploads/documents/${filename}`, file.data.length, file.type, user.userId)

    return {
      id: result.lastInsertRowid,
      title: title.trim(),
      description,
      category_id: parseInt(categoryId),
      filename,
      original_filename: file.filename || 'unknown',
      file_size: file.data.length,
      mime_type: file.type,
      uploaded_by: user.userId,
      created_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('Upload error details:', error)
    // Clean up file if database insert failed
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload document'
    })
  }
})
