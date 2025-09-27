import { supabase } from './supabase'
import type { NewsArticle } from './admin-storage'

// Преобразование данных из Supabase в формат NewsArticle
function transformSupabaseToNewsArticle(data: any): NewsArticle {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    content: data.content,
    image: data.image || '',
    contentImage: data.content_image || '',
    contentSections: data.content_sections || [],
    published: data.published || false,
    show_on_homepage: data.show_on_homepage || false,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Преобразование данных из NewsArticle в формат Supabase
function transformNewsArticleToSupabase(article: NewsArticle): any {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    content: article.content,
    image: article.image || null,
    content_image: article.contentImage || null,
    content_sections: article.contentSections || [],
    published: article.published || false,
    show_on_homepage: article.show_on_homepage || false,
    created_at: article.createdAt,
    updated_at: article.updatedAt,
  }
}

// Кэш для новостей
let newsCache: NewsArticle[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

export async function getNewsArticles(): Promise<NewsArticle[]> {
  // Проверяем кэш
  if (newsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return newsCache
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching news articles:', error)
      throw error
    }

    const transformedData = data.map(transformSupabaseToNewsArticle)
    
    // Обновляем кэш
    newsCache = transformedData
    cacheTimestamp = Date.now()

    return transformedData
  } catch (error) {
    console.error('Error in getNewsArticles:', error)
    // Возвращаем кэшированные данные в случае ошибки
    if (newsCache) {
      return newsCache
    }
    throw error
  }
}

export async function getPublishedNews(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from('published_news')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching published news:', error)
      throw error
    }

    return data.map(transformSupabaseToNewsArticle)
  } catch (error) {
    console.error('Error in getPublishedNews:', error)
    throw error
  }
}

export async function getHomepageNews(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from('homepage_news')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching homepage news:', error)
      throw error
    }

    return data.map(transformSupabaseToNewsArticle)
  } catch (error) {
    console.error('Error in getHomepageNews:', error)
    throw error
  }
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Article not found
      }
      console.error('Error fetching news article:', error)
      throw error
    }

    return transformSupabaseToNewsArticle(data)
  } catch (error) {
    console.error('Error in getNewsById:', error)
    throw error
  }
}

export async function addNewsArticle(article: NewsArticle): Promise<NewsArticle> {
  try {
    const supabaseData = transformNewsArticleToSupabase(article)

    const { data, error } = await supabase
      .from('news_articles')
      .insert(supabaseData)
      .select()
      .single()

    if (error) {
      console.error('Error adding news article:', error)
      throw error
    }

    const transformedData = transformSupabaseToNewsArticle(data)
    
    // Очищаем кэш
    clearNewsCache()

    return transformedData
  } catch (error) {
    console.error('Error in addNewsArticle:', error)
    throw error
  }
}

export async function updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle> {
  try {
    const supabaseData = transformNewsArticleToSupabase(updates as NewsArticle)
    supabaseData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('news_articles')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating news article:', error)
      throw error
    }

    const transformedData = transformSupabaseToNewsArticle(data)
    
    // Очищаем кэш
    clearNewsCache()

    return transformedData
  } catch (error) {
    console.error('Error in updateNewsArticle:', error)
    throw error
  }
}

export async function deleteNewsArticle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news article:', error)
      throw error
    }

    // Очищаем кэш
    clearNewsCache()

    return true
  } catch (error) {
    console.error('Error in deleteNewsArticle:', error)
    throw error
  }
}

// Функция для очистки кэша
export function clearNewsCache(): void {
  newsCache = null
  cacheTimestamp = 0
}

// Функция для получения новостей с принудительным обновлением
export async function refreshNewsArticles(): Promise<NewsArticle[]> {
  clearNewsCache()
  return await getNewsArticles()
}

// Функция для форматирования даты
export function formatNewsDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    return 'Дата не указана'
  }
}

// Функция для получения новости с деталями
export async function getNewsWithDetails(id: string) {
  const article = await getNewsById(id)
  if (!article) return null

  const contentSections = article.contentSections && article.contentSections.length > 0
    ? article.contentSections
    : [
        {
          title: 'Подробности',
          text: article.content,
        },
      ]

  // Добавляем дополнительные поля для совместимости с существующими компонентами
  return {
    ...article,
    date: formatNewsDate(article.createdAt),
    contentImage: article.contentImage || article.image,
    contentSections,
  }
}

// Функция для миграции данных из localStorage
export async function migrateNewsDataFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem('admin_news')
    if (!stored) return

    const localData = JSON.parse(stored)
    const supabaseData = localData.map(transformNewsArticleToSupabase)

    const { error } = await supabase
      .from('news_articles')
      .upsert(supabaseData)

    if (error) {
      console.error('Error migrating news data:', error)
      throw error
    }

    console.log('News data migrated successfully')
  } catch (error) {
    console.error('Error in migrateNewsDataFromLocalStorage:', error)
    throw error
  }
}

// Функция для инициализации данных по умолчанию
export async function initializeDefaultNewsData(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Error checking existing data:', error)
      throw error
    }

    // Если данных нет, создаем дефолтные
    if (!data || data.length === 0) {
      const defaultNews = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          title: 'Новые курсы обмена поврежденных долларов США',
          description: 'Обновили тарифы на обмен поврежденных банкнот долларов США. Теперь принимаем купюры с незначительными повреждениями по еще более выгодному курсу.',
          content: 'С 15 декабря 2024 года вступают в силу новые, более выгодные тарифы на обмен поврежденных банкнот долларов США. Мы пересмотрели критерии оценки состояния купюр и теперь можем предложить лучшие условия для наших клиентов.\n\nБанкноты с незначительными повреждениями (небольшие надрывы, потертости, загрязнения) теперь принимаются по курсу, максимально приближенному к курсу неповрежденных купюр. Это касается банкнот номиналом от $1 до $100.\n\nОценка состояния банкнот производится при клиенте с использованием профессионального оборудования. Весь процесс занимает не более 10 минут, после чего клиент получает наличные по актуальному курсу.',
          image: '/placeholder.svg?height=200&width=400',
          content_image: '/placeholder.svg?height=200&width=400',
          content_sections: [
            {
              title: 'Подробности',
              text: 'С 15 декабря 2024 года вступают в силу новые, более выгодные тарифы на обмен поврежденных банкнот долларов США. Мы пересмотрели критерии оценки состояния купюр и теперь можем предложить лучшие условия для наших клиентов.\n\nБанкноты с незначительными повреждениями (небольшие надрывы, потертости, загрязнения) теперь принимаются по курсу, максимально приближенному к курсу неповрежденных купюр. Это касается банкнот номиналом от $1 до $100.\n\nОценка состояния банкнот производится при клиенте с использованием профессионального оборудования. Весь процесс занимает не более 10 минут, после чего клиент получает наличные по актуальному курсу.',
            },
          ],
          published: true,
          show_on_homepage: true,
          created_by: '00000000-0000-0000-0000-000000000001',
        },
      ]

      const { error: insertError } = await supabase
        .from('news_articles')
        .insert(defaultNews)

      if (insertError) {
        console.error('Error inserting default news data:', insertError)
        throw insertError
      }

      console.log('Default news data initialized')
    }
  } catch (error) {
    console.error('Error in initializeDefaultNewsData:', error)
    throw error
  }
}
