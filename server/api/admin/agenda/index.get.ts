import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_agenda')(event)

  try {
    // Fetch all agendas with categories
    const sql = `
      SELECT a.*, c.name as category_name, c.color as category_color, c.slug as category_slug
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      ORDER BY a.start_date ASC
    `;

    const agendas = allQuery(sql);

    // Convert to plain objects for JSON serialization
    return agendas.map((agenda: any) => ({
      id: agenda.id,
      title: agenda.title,
      description: agenda.description,
      start_date: agenda.start_date,
      end_date: agenda.end_date,
      location: agenda.location,
      category_id: agenda.category_id,
      category_name: agenda.category_name || 'Uncategorized',
      category_color: agenda.category_color,
      category_slug: agenda.category_slug,
      contact_person: agenda.contact_person,
      created_at: agenda.created_at,
      updated_at: agenda.updated_at
    }));
  } catch (error) {
    console.error('Error fetching admin agendas:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});
