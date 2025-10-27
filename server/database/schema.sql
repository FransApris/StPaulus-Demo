-- Database schema for St. Paulus CMS

-- Users table for admin and booking user authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'admin' or 'user' (legacy, will be migrated to role_id)
  role_id INTEGER, -- Foreign key to roles table
  full_name TEXT,
  contact_phone TEXT,
  user_category TEXT, -- 'PARISH_COUNCIL', 'CATEGORICAL_GROUP', 'REGION', 'COMMUNITY'
  unit_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- Roles table for RBAC
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL, -- 'super_admin', 'admin_komsos', 'admin_sekretariat'
  display_name TEXT NOT NULL, -- 'Super Admin', 'Admin Komsos', 'Admin Sekretariat'
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table for RBAC
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL, -- 'manage_articles', 'manage_gallery', etc.
  display_name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permission relations table (many-to-many)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  status TEXT DEFAULT 'draft', -- draft, published, archived
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  status TEXT DEFAULT 'draft',
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery categories table
CREATE TABLE IF NOT EXISTS gallery_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_kategori TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6B7280',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery albums table
CREATE TABLE IF NOT EXISTS gallery_albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tanggal_peristiwa DATE,
  category_id INTEGER,
  cover_image TEXT,
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES gallery_categories (id) ON DELETE SET NULL
);

-- Gallery photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT,
  path TEXT NOT NULL,
  size INTEGER,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES gallery_albums (id) ON DELETE CASCADE
);

-- Categories table for agenda categories
CREATE TABLE IF NOT EXISTS agenda_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6B7280',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agendas table for parish events and schedules
CREATE TABLE IF NOT EXISTS agendas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  location TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  contact_person TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES agenda_categories (id) ON DELETE RESTRICT
);

-- Article categories table for hierarchical categorization
CREATE TABLE IF NOT EXISTS article_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id INTEGER,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES article_categories (id) ON DELETE SET NULL
);

-- Article-category relations table (many-to-many)
CREATE TABLE IF NOT EXISTS article_category_relations (
  article_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES article_categories (id) ON DELETE CASCADE
);

-- News-category relations table (many-to-many)
CREATE TABLE IF NOT EXISTS news_category_relations (
  news_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (news_id, category_id),
  FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES article_categories (id) ON DELETE CASCADE
);

-- Contact messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Liturgy types table (Misa, Sakramen Tobat, Adorasi, dll)
CREATE TABLE IF NOT EXISTS liturgy_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT NOT NULL DEFAULT '#6B7280',
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Liturgy schedules table
CREATE TABLE IF NOT EXISTS liturgy_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  liturgy_type_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  date DATE,
  time TEXT NOT NULL,
  language TEXT DEFAULT 'Indonesia',
  priest_name TEXT,
  location TEXT NOT NULL DEFAULT 'Gereja Utama',
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  recurrence_end_date DATE,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (liturgy_type_id) REFERENCES liturgy_types (id) ON DELETE RESTRICT
);



-- Regular mass schedules table (for recurring weekly/daily schedules)
CREATE TABLE IF NOT EXISTS regular_mass_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week TEXT NOT NULL, -- 'Senin', 'Selasa', 'Minggu', etc.
  time TEXT NOT NULL, -- '05:30', '17:00', etc.
  mass_type TEXT NOT NULL, -- 'Misa Pagi', 'Misa Sore', etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table for room booking system
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  location TEXT NOT NULL,
  facilities TEXT, -- JSON array of facilities
  photo_url TEXT,
  requires_approval BOOLEAN DEFAULT TRUE,
  allowed_categories TEXT, -- JSON array of allowed user_categories
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table for room reservations
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  event_name TEXT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Chatbot FAQs table for AI chatbot knowledge base
CREATE TABLE IF NOT EXISTS chatbot_faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT, -- 'mass', 'sacraments', 'parish_info', etc.
  keywords TEXT, -- JSON array of keywords for matching
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_categories_slug ON gallery_categories(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_categories_is_active ON gallery_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_categories_display_order ON gallery_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_category ON gallery_albums(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_tanggal_peristiwa ON gallery_albums(tanggal_peristiwa);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_album ON gallery_photos(album_id);
CREATE INDEX IF NOT EXISTS idx_agenda_categories_slug ON agenda_categories(slug);
CREATE INDEX IF NOT EXISTS idx_agendas_category_id ON agendas(category_id);
CREATE INDEX IF NOT EXISTS idx_agendas_start_date ON agendas(start_date);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_article_categories_slug ON article_categories(slug);
CREATE INDEX IF NOT EXISTS idx_article_categories_parent ON article_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_article_category_relations_article ON article_category_relations(article_id);
CREATE INDEX IF NOT EXISTS idx_article_category_relations_category ON article_category_relations(category_id);
CREATE INDEX IF NOT EXISTS idx_news_category_relations_news ON news_category_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_category_relations_category ON news_category_relations(category_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_liturgy_types_slug ON liturgy_types(slug);
CREATE INDEX IF NOT EXISTS idx_liturgy_types_is_active ON liturgy_types(is_active);
CREATE INDEX IF NOT EXISTS idx_liturgy_schedules_type ON liturgy_schedules(liturgy_type_id);
CREATE INDEX IF NOT EXISTS idx_liturgy_schedules_date ON liturgy_schedules(date);
CREATE INDEX IF NOT EXISTS idx_liturgy_schedules_status ON liturgy_schedules(status);
CREATE INDEX IF NOT EXISTS idx_liturgy_schedules_is_recurring ON liturgy_schedules(is_recurring);

-- Indexes for room booking system
CREATE INDEX IF NOT EXISTS idx_rooms_is_active ON rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);

-- Indexes for chatbot FAQs
CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_category ON chatbot_faqs(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_is_active ON chatbot_faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_usage_count ON chatbot_faqs(usage_count);
-- User categories table for dynamic user categorization
CREATE TABLE IF NOT EXISTS user_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user categories
CREATE INDEX IF NOT EXISTS idx_user_categories_name ON user_categories(name);
CREATE INDEX IF NOT EXISTS idx_user_categories_is_active ON user_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_user_categories_display_order ON user_categories(display_order);
-- User categories table for dynamic user categorization
CREATE TABLE IF NOT EXISTS user_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user categories
CREATE INDEX IF NOT EXISTS idx_user_categories_name ON user_categories(name);
CREATE INDEX IF NOT EXISTS idx_user_categories_is_active ON user_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_user_categories_display_order ON user_categories(display_order);
-- Chatbot FAQ Categories table for dynamic category management
CREATE TABLE IF NOT EXISTS chatbot_faq_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6B7280',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for chatbot FAQ categories
CREATE INDEX IF NOT EXISTS idx_chatbot_faq_categories_slug ON chatbot_faq_categories(slug);
CREATE INDEX IF NOT EXISTS idx_chatbot_faq_categories_is_active ON chatbot_faq_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_faq_categories_display_order ON chatbot_faq_categories(display_order);
-- Document Categories table for document categorization
CREATE TABLE IF NOT EXISTS document_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6B7280',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Documents table for parish document management
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES document_categories (id) ON DELETE RESTRICT,
  FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for document categories
CREATE INDEX IF NOT EXISTS idx_document_categories_slug ON document_categories(slug);
CREATE INDEX IF NOT EXISTS idx_document_categories_is_active ON document_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_document_categories_display_order ON document_categories(display_order);

-- Create indexes for documents
CREATE INDEX IF NOT EXISTS idx_documents_category_id ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_filename ON documents(filename);
-- Hero themes table for managing hero section themes
CREATE TABLE IF NOT EXISTS hero_themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  image_path TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index to ensure only one active theme
CREATE UNIQUE INDEX IF NOT EXISTS idx_hero_themes_active
ON hero_themes(is_active)
WHERE is_active = TRUE;
-- Pages table for static content management
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    is_published INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for pages
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_is_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at);
