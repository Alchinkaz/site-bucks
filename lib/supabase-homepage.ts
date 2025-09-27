import { supabase } from './supabase'
import type { HomepageData, Review, ImageGalleryItem, FAQItem, CurrencyRate, ContactsSection } from './homepage-data'

// Преобразование данных из Supabase в формат HomepageData
function transformSupabaseToHomepageData(data: any): HomepageData {
  return {
    heroTitle: data.hero_title,
    heroSubtitle: data.hero_subtitle,
    heroButtonText: data.hero_button_text,
    heroButtonLink: data.hero_button_link,
    heroImage: data.hero_image || '/money-bills-background.jpg',

    aboutImage: data.about_image || '/placeholder.svg?height=270&width=480',
    aboutText: data.about_text,
    aboutDescription: data.about_description,

    stat1Title: data.stat1_title,
    stat1Subtitle: data.stat1_subtitle,
    stat2Title: data.stat2_title,
    stat2Subtitle: data.stat2_subtitle,
    stat3Title: data.stat3_title,
    stat3Subtitle: data.stat3_subtitle,

    reviews: data.reviews || [],
    imageGallery: data.image_gallery || [],
    faqItems: data.faq_items || [],

    contactsSection: {
      phone: data.contacts_phone,
      email: data.contacts_email,
      buttonText: data.contacts_button_text,
      buttonLink: data.contacts_button_link,
      mapIframe: data.contacts_map_iframe || '',
    },

    currencyRates: data.currency_rates || [],
    tickerTexts: data.ticker_texts || [],
  }
}

// Преобразование данных из HomepageData в формат Supabase
function transformHomepageDataToSupabase(data: HomepageData): any {
  return {
    hero_title: data.heroTitle,
    hero_subtitle: data.heroSubtitle,
    hero_button_text: data.heroButtonText,
    hero_button_link: data.heroButtonLink,
    hero_image: data.heroImage,

    about_image: data.aboutImage,
    about_text: data.aboutText,
    about_description: data.aboutDescription,

    stat1_title: data.stat1Title,
    stat1_subtitle: data.stat1Subtitle,
    stat2_title: data.stat2Title,
    stat2_subtitle: data.stat2Subtitle,
    stat3_title: data.stat3Title,
    stat3_subtitle: data.stat3Subtitle,

    reviews: data.reviews,
    image_gallery: data.imageGallery,
    faq_items: data.faqItems,

    contacts_phone: data.contactsSection.phone,
    contacts_email: data.contactsSection.email,
    contacts_button_text: data.contactsSection.buttonText,
    contacts_button_link: data.contactsSection.buttonLink,
    contacts_map_iframe: data.contactsSection.mapIframe,

    currency_rates: data.currencyRates,
    ticker_texts: data.tickerTexts,
  }
}

// Кэш для данных главной страницы
let homepageDataCache: HomepageData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

export async function getHomepageData(): Promise<HomepageData> {
  // Проверяем кэш
  if (homepageDataCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return homepageDataCache
  }

  try {
    const { data, error } = await supabase
      .from('homepage_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching homepage data:', error)
      throw error
    }

    if (!data) {
      throw new Error('No homepage data found')
    }

    const transformedData = transformSupabaseToHomepageData(data)
    
    // Обновляем кэш
    homepageDataCache = transformedData
    cacheTimestamp = Date.now()

    return transformedData
  } catch (error) {
    console.error('Error in getHomepageData:', error)
    // Возвращаем кэшированные данные в случае ошибки
    if (homepageDataCache) {
      return homepageDataCache
    }
    throw error
  }
}

export async function updateHomepageData(updates: Partial<HomepageData>): Promise<HomepageData> {
  try {
    // Получаем текущие данные
    const currentData = await getHomepageData()
    const updatedData = { ...currentData, ...updates }

    // Преобразуем в формат Supabase
    const supabaseData = transformHomepageDataToSupabase(updatedData)

    // Обновляем в базе данных
    const { data, error } = await supabase
      .from('homepage_data')
      .upsert(supabaseData)
      .select()
      .single()

    if (error) {
      console.error('Error updating homepage data:', error)
      throw error
    }

    const transformedData = transformSupabaseToHomepageData(data)
    
    // Обновляем кэш
    homepageDataCache = transformedData
    cacheTimestamp = Date.now()

    // Уведомляем компоненты об обновлении
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('homepage-data-updated', {
          detail: { ...transformedData, timestamp: Date.now() },
        })
      )
    }

    return transformedData
  } catch (error) {
    console.error('Error in updateHomepageData:', error)
    throw error
  }
}

// Функция для очистки кэша (полезно при обновлениях)
export function clearHomepageDataCache(): void {
  homepageDataCache = null
  cacheTimestamp = 0
}

// Функция для получения данных с принудительным обновлением
export async function refreshHomepageData(): Promise<HomepageData> {
  clearHomepageDataCache()
  return await getHomepageData()
}

// Функция для миграции данных из localStorage
export async function migrateHomepageDataFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem('homepage-data')
    if (!stored) return

    const localData = JSON.parse(stored)
    const supabaseData = transformHomepageDataToSupabase(localData)

    const { error } = await supabase
      .from('homepage_data')
      .upsert(supabaseData)

    if (error) {
      console.error('Error migrating homepage data:', error)
      throw error
    }

    console.log('Homepage data migrated successfully')
  } catch (error) {
    console.error('Error in migrateHomepageDataFromLocalStorage:', error)
    throw error
  }
}

// Функция для инициализации данных по умолчанию
export async function initializeDefaultHomepageData(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('homepage_data')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Error checking existing data:', error)
      throw error
    }

    // Если данных нет, создаем дефолтные
    if (!data || data.length === 0) {
      const defaultData = {
        hero_title: 'Обмен ветхой валюты в Астане по выгодному курсу',
        hero_subtitle: 'Принимаем доллары, евро, фунты, франки и другие валюты с дефектами, печатями и повреждениями.',
        hero_button_text: 'Получить консультацию',
        hero_button_link: 'https://wa.me/77773231715',
        hero_image: '/money-bills-background.jpg',
        about_image: '/placeholder.svg?height=270&width=480',
        about_text: 'При вас оценим состояние купюр и обменяли их по лучшему курсу',
        about_description: 'Не каждый банк в Казахстане принимает поврежденные и ветхие банкноты. Мы специализируемся на обмене валют любого состояния: надорванные, выцветшие, с печатями, пятнами или другими повреждениями. Минимальная сумма обмена от 100$/€/£.',
        stat1_title: '5+ лет',
        stat1_subtitle: 'Опыт работы на валютном рынке',
        stat2_title: '15+ валют',
        stat2_subtitle: 'Принимаем к обмену',
        stat3_title: '1000+',
        stat3_subtitle: 'Довольных клиентов',
        reviews: [],
        image_gallery: [],
        faq_items: [],
        contacts_phone: '+7 (777) 323-17-15',
        contacts_email: 'shotkin.azat@gmail.com',
        contacts_button_text: 'Получить консультацию',
        contacts_button_link: 'https://wa.me/77773231715',
        contacts_map_iframe: '',
        currency_rates: [],
        ticker_texts: [],
      }

      const { error: insertError } = await supabase
        .from('homepage_data')
        .insert(defaultData)

      if (insertError) {
        console.error('Error inserting default data:', insertError)
        throw insertError
      }

      console.log('Default homepage data initialized')
    }
  } catch (error) {
    console.error('Error in initializeDefaultHomepageData:', error)
    throw error
  }
}
