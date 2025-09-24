export interface User {
  id: string
  username: string
  password: string
  role: "admin"
  createdAt: string
  lastLogin?: string
}

export interface Order {
  id: string
  productName: string
  productImage?: string
  quantity: number
  contact: string
  city: string
  status: "new" | "processing" | "completed"
  createdAt: string
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  image?: string
  contentImage?: string
  contentSections?: Array<{ title: string; text: string }>
  published: boolean
  show_on_homepage: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  content: string
  image?: string
  published: boolean
  show_on_homepage: boolean
  createdAt: string
  updatedAt: string
}

// Утилиты для работы с localStorage
export class AdminStorage {
  private static isBrowser(): boolean {
    return typeof window !== "undefined"
  }

  // Пользователи
  static getUsers(): User[] {
    try {
      if (!this.isBrowser()) {
        return []
      }
      const users = localStorage.getItem("admin_users")
      if (!users) {
        // Создаем дефолтного админа
        const defaultAdmin: User = {
          id: "1",
          username: "admin",
          password: "admin123",
          role: "admin",
          createdAt: new Date().toISOString(),
        }
        this.setUsers([defaultAdmin])
        return [defaultAdmin]
      }
      return JSON.parse(users)
    } catch (error) {
      console.error("Error getting users:", error)
      return []
    }
  }

  static setUsers(users: User[]): void {
    try {
      if (!this.isBrowser()) {
        return
      }
      localStorage.setItem("admin_users", JSON.stringify(users))
    } catch (error) {
      console.error("Error setting users:", error)
    }
  }

  static updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === id)
    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    this.setUsers(users)
    return users[userIndex]
  }

  // Заявки
  static getOrders(): Order[] {
    try {
      if (!this.isBrowser()) {
        return []
      }
      const orders = localStorage.getItem("admin_orders")
      return orders ? JSON.parse(orders) : []
    } catch (error) {
      console.error("Error getting orders:", error)
      return []
    }
  }

  static setOrders(orders: Order[]): void {
    try {
      if (!this.isBrowser()) {
        return
      }
      localStorage.setItem("admin_orders", JSON.stringify(orders))
    } catch (error) {
      console.error("Error setting orders:", error)
    }
  }

  static addOrder(order: Order): void {
    const orders = this.getOrders()
    orders.unshift(order) // Добавляем в начало для сортировки по дате
    this.setOrders(orders)
  }

  static updateOrderStatus(id: string, status: Order["status"]): boolean {
    const orders = this.getOrders()
    const orderIndex = orders.findIndex((o) => o.id === id)
    if (orderIndex === -1) return false

    orders[orderIndex].status = status
    this.setOrders(orders)
    return true
  }

  static deleteOrder(id: string): boolean {
    const orders = this.getOrders()
    const filteredOrders = orders.filter((o) => o.id !== id)
    if (filteredOrders.length === orders.length) return false

    this.setOrders(filteredOrders)
    return true
  }

  // Новости
  static getNewsArticles(): NewsArticle[] {
    try {
      if (!this.isBrowser()) {
        return []
      }
      const articles = localStorage.getItem("admin_news")
      return articles ? JSON.parse(articles) : []
    } catch (error) {
      console.error("Error getting news articles:", error)
      return []
    }
  }

  static setNewsArticles(articles: NewsArticle[]): void {
    try {
      if (!this.isBrowser()) {
        return
      }
      localStorage.setItem("admin_news", JSON.stringify(articles))
    } catch (error) {
      console.error("Error setting news articles:", error)
    }
  }

  static addNewsArticle(article: NewsArticle): void {
    const articles = this.getNewsArticles()
    articles.unshift(article)
    this.setNewsArticles(articles)
  }

  static updateNewsArticle(id: string, updates: Partial<NewsArticle>): boolean {
    const articles = this.getNewsArticles()
    const articleIndex = articles.findIndex((a) => a.id === id)
    if (articleIndex === -1) return false

    articles[articleIndex] = { ...articles[articleIndex], ...updates, updatedAt: new Date().toISOString() }
    this.setNewsArticles(articles)
    return true
  }

  static deleteNewsArticle(id: string): boolean {
    const articles = this.getNewsArticles()
    const filteredArticles = articles.filter((a) => a.id !== id)
    if (filteredArticles.length === articles.length) return false

    this.setNewsArticles(filteredArticles)
    return true
  }

  // Проекты
  static getProjects(): Project[] {
    try {
      if (!this.isBrowser()) {
        return []
      }
      const projects = localStorage.getItem("admin_projects")
      return projects ? JSON.parse(projects) : []
    } catch (error) {
      console.error("Error getting projects:", error)
      return []
    }
  }

  static setProjects(projects: Project[]): void {
    try {
      if (!this.isBrowser()) {
        return
      }
      localStorage.setItem("admin_projects", JSON.stringify(projects))
    } catch (error) {
      console.error("Error setting projects:", error)
    }
  }

  static addProject(project: Project): void {
    const projects = this.getProjects()
    projects.unshift(project)
    this.setProjects(projects)
  }

  static updateProject(id: string, updates: Partial<Project>): boolean {
    const projects = this.getProjects()
    const projectIndex = projects.findIndex((p) => p.id === id)
    if (projectIndex === -1) return false

    projects[projectIndex] = { ...projects[projectIndex], ...updates, updatedAt: new Date().toISOString() }
    this.setProjects(projects)
    return true
  }

  static deleteProject(id: string): boolean {
    const projects = this.getProjects()
    const filteredProjects = projects.filter((p) => p.id !== id)
    if (filteredProjects.length === projects.length) return false

    this.setProjects(filteredProjects)
    return true
  }

  // Авторизация
  static getCurrentUser(): User | null {
    try {
      if (!this.isBrowser()) {
        return null
      }
      const userData = localStorage.getItem("current_user")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  static setCurrentUser(user: User): void {
    try {
      if (!this.isBrowser()) {
        return
      }
      localStorage.setItem("current_user", JSON.stringify(user))
      localStorage.setItem("admin_token", "authenticated")
    } catch (error) {
      console.error("Error setting current user:", error)
    }
  }

  static logout(): void {
    try {
      if (!this.isBrowser()) {
        return
      }
      localStorage.removeItem("current_user")
      localStorage.removeItem("admin_token")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  static isAuthenticated(): boolean {
    try {
      if (!this.isBrowser()) {
        return false
      }
      const token = localStorage.getItem("admin_token")
      const userData = localStorage.getItem("current_user")
      return token === "authenticated" && !!userData
    } catch (error) {
      console.error("Error checking authentication:", error)
      return false
    }
  }
}

export const PAGE_LABELS: Record<string, string> = {
  currency: "Курсы валют",
  homepage: "Главная страница",
  news: "Новости",
  contacts: "Контакты",
  users: "Пользователи",
}

export const getDefaultPermissions = (role: "admin" | "editor") => {
  if (role === "admin") {
    // Super admin gets all permissions
    return {
      currency: true,
      homepage: true,
      news: true,
      contacts: true,
      users: true,
    }
  } else {
    // Regular editors get no permissions by default
    return {
      currency: false,
      homepage: false,
      news: false,
      contacts: false,
      users: false,
    }
  }
}
