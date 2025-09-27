import { supabase } from './supabase'
import type { User, Order, NewsArticle, Project } from './admin-storage'

// =============================================
// USERS MANAGEMENT
// =============================================

export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      throw error
    }

    return data.map(user => ({
      id: user.id,
      username: user.username,
      password: user.password_hash, // В реальном проекте не возвращайте хэш пароля
      role: user.role,
      createdAt: user.created_at,
      lastLogin: user.last_login,
    }))
  } catch (error) {
    console.error('Error in getUsers:', error)
    throw error
  }
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: userData.username,
        password_hash: userData.password, // В реальном проекте хэшируйте пароль
        role: userData.role,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      throw error
    }

    return {
      id: data.id,
      username: data.username,
      password: data.password_hash,
      role: data.role,
      createdAt: data.created_at,
      lastLogin: data.last_login,
    }
  } catch (error) {
    console.error('Error in createUser:', error)
    throw error
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    const updateData: any = {}
    if (updates.username) updateData.username = updates.username
    if (updates.password) updateData.password_hash = updates.password
    if (updates.role) updateData.role = updates.role
    if (updates.lastLogin) updateData.last_login = updates.lastLogin

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      throw error
    }

    return {
      id: data.id,
      username: data.username,
      password: data.password_hash,
      role: data.role,
      createdAt: data.created_at,
      lastLogin: data.last_login,
    }
  } catch (error) {
    console.error('Error in updateUser:', error)
    throw error
  }
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    // Сначала проверяем текущий пароль
    const user = await getUserById(userId)
    if (!user || user.password !== currentPassword) {
      return false
    }

    // Обновляем пароль
    const { error } = await supabase
      .from('users')
      .update({ 
        password_hash: newPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating password:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateUserPassword:', error)
    return false
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteUser:', error)
    throw error
  }
}

// =============================================
// ORDERS MANAGEMENT
// =============================================

export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      throw error
    }

    return data.map(order => ({
      id: order.id,
      productName: order.product_name,
      productImage: order.product_image || '',
      quantity: order.quantity,
      contact: order.contact,
      city: order.city,
      status: order.status,
      createdAt: order.created_at,
    }))
  } catch (error) {
    console.error('Error in getOrders:', error)
    throw error
  }
}

export async function addOrder(order: Order): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        product_name: order.productName,
        product_image: order.productImage || null,
        quantity: order.quantity,
        contact: order.contact,
        city: order.city,
        status: order.status,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding order:', error)
      throw error
    }

    return {
      id: data.id,
      productName: data.product_name,
      productImage: data.product_image || '',
      quantity: data.quantity,
      contact: data.contact,
      city: data.city,
      status: data.status,
      createdAt: data.created_at,
    }
  } catch (error) {
    console.error('Error in addOrder:', error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating order status:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in updateOrderStatus:', error)
    throw error
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting order:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteOrder:', error)
    throw error
  }
}

// =============================================
// PROJECTS MANAGEMENT
// =============================================

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      throw error
    }

    return data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      content: project.content,
      image: project.image || '',
      published: project.published,
      show_on_homepage: project.show_on_homepage,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    }))
  } catch (error) {
    console.error('Error in getProjects:', error)
    throw error
  }
}

export async function addProject(project: Project): Promise<Project> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        content: project.content,
        image: project.image || null,
        published: project.published,
        show_on_homepage: project.show_on_homepage,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding project:', error)
      throw error
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image || '',
      published: data.published,
      show_on_homepage: data.show_on_homepage,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error('Error in addProject:', error)
    throw error
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  try {
    const updateData: any = {}
    if (updates.title) updateData.title = updates.title
    if (updates.description) updateData.description = updates.description
    if (updates.content) updateData.content = updates.content
    if (updates.image !== undefined) updateData.image = updates.image
    if (updates.published !== undefined) updateData.published = updates.published
    if (updates.show_on_homepage !== undefined) updateData.show_on_homepage = updates.show_on_homepage

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      throw error
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image || '',
      published: data.published,
      show_on_homepage: data.show_on_homepage,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error('Error in updateProject:', error)
    throw error
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteProject:', error)
    throw error
  }
}

// =============================================
// AUTHENTICATION
// =============================================

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    console.log('🔐 Attempting to authenticate user:', username)
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('❌ Error authenticating user:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    console.log('✅ User found:', {
      id: data.id,
      username: data.username,
      role: data.role,
      hasPassword: !!data.password_hash
    })

    // В реальном проекте используйте bcrypt для проверки пароля
    if (data.password_hash !== password) {
      console.log('❌ Password mismatch')
      return null
    }

    console.log('✅ Password correct, updating last login')

    // Обновляем время последнего входа (если поле существует)
    try {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id)
    } catch (updateError) {
      console.log('⚠️ Could not update last_login (field may not exist):', updateError)
      // Игнорируем ошибку, если поле не существует
    }

    const user = {
      id: data.id,
      username: data.username,
      password: data.password_hash,
      role: data.role,
      createdAt: data.created_at,
      lastLogin: data.last_login,
    }

    console.log('✅ Authentication successful:', user)
    return user
  } catch (error) {
    console.error('❌ Error in authenticateUser:', error)
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  try {
    // Генерируем простой токен без сохранения в базе данных
    const token = generateToken()
    console.log('✅ Session token generated:', token)
    return token
  } catch (error) {
    console.error('Error in createSession:', error)
    throw error
  }
}

export async function validateSession(token: string): Promise<User | null> {
  try {
    // Простая проверка токена без обращения к базе данных
    if (!token || token.length < 10) {
      return null
    }

    // Получаем пользователя из localStorage
    const userData = localStorage.getItem('current_user')
    if (!userData) {
      return null
    }

    const user = JSON.parse(userData)
    console.log('✅ Session validated for user:', user.username)
    return user
  } catch (error) {
    console.error('Error in validateSession:', error)
    return null
  }
}

export async function deleteSession(token: string): Promise<boolean> {
  try {
    // Просто очищаем localStorage
    localStorage.removeItem('admin_token')
    localStorage.removeItem('current_user')
    console.log('✅ Session deleted from localStorage')
    return true
  } catch (error) {
    console.error('Error in deleteSession:', error)
    return false
  }
}

export async function cleanExpiredSessions(): Promise<void> {
  try {
    // Очищаем только localStorage, так как сессии больше не хранятся в базе данных
    console.log('✅ Cleaning expired sessions from localStorage')
    // Можно добавить логику очистки старых токенов из localStorage если нужно
  } catch (error) {
    console.error('Error cleaning expired sessions:', error)
    throw error
  }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Функция для миграции данных из localStorage
export async function migrateAdminDataFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Миграция пользователей
    const usersData = localStorage.getItem('admin_users')
    if (usersData) {
      const users = JSON.parse(usersData)
      for (const user of users) {
        await supabase
          .from('users')
          .upsert({
            id: user.id,
            username: user.username,
            password_hash: user.password,
            role: user.role,
            created_at: user.createdAt,
            last_login: user.lastLogin,
          })
      }
    }

    // Миграция заказов
    const ordersData = localStorage.getItem('admin_orders')
    if (ordersData) {
      const orders = JSON.parse(ordersData)
      for (const order of orders) {
        await supabase
          .from('orders')
          .upsert({
            id: order.id,
            product_name: order.productName,
            product_image: order.productImage || null,
            quantity: order.quantity,
            contact: order.contact,
            city: order.city,
            status: order.status,
            created_at: order.createdAt,
          })
      }
    }

    // Миграция проектов
    const projectsData = localStorage.getItem('admin_projects')
    if (projectsData) {
      const projects = JSON.parse(projectsData)
      for (const project of projects) {
        await supabase
          .from('projects')
          .upsert({
            id: project.id,
            title: project.title,
            description: project.description,
            content: project.content,
            image: project.image || null,
            published: project.published,
            show_on_homepage: project.show_on_homepage,
            created_at: project.createdAt,
            updated_at: project.updatedAt,
          })
      }
    }

    console.log('Admin data migrated successfully')
  } catch (error) {
    console.error('Error in migrateAdminDataFromLocalStorage:', error)
    throw error
  }
}
