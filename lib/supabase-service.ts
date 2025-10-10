// Типы для совместимости с компонентами
export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "editor" | "superadmin"
  permissions: {
    products: boolean
    homepage: boolean
    contacts: boolean
    about: boolean
    services: boolean
    users?: boolean
  }
  created_at: string
  last_login?: string
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  image?: string
  heroImage?: string
  contentImage?: string
  images?: string[]
  published: boolean
  show_on_homepage: boolean
  date?: string
  author?: string
  category?: string
  contentSections?: Array<{ title: string; text: string }>
  created_at?: string
  updated_at?: string
  createdAt: string
  updatedAt: string
}
