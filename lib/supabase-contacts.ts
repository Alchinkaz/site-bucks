import { supabase } from './supabase'
import type { ContactsData } from './contacts-data'

// Преобразование данных из Supabase в формат ContactsData
function transformSupabaseToContactsData(data: any): ContactsData {
  return {
    phone: data.phone,
    email: data.email,
    address: data.address,
    workingHours: data.working_hours || {
      weekdays: '09:00 - 19:00',
      saturday: '10:00 - 16:00',
      sunday: 'Выходной',
    },
    whatsappNumbers: data.whatsapp_numbers || {
      primary: '77773231715',
    },
    mapIframe: data.map_iframe || '',
    gisLink: data.gis_link || '',
    gisButtonText: data.gis_button_text || '',
  }
}

// Преобразование данных из ContactsData в формат Supabase
function transformContactsDataToSupabase(data: ContactsData): any {
  return {
    phone: data.phone,
    email: data.email,
    address: data.address,
    working_hours: data.workingHours,
    whatsapp_numbers: data.whatsappNumbers,
    map_iframe: data.mapIframe,
    gis_link: data.gisLink,
    gis_button_text: data.gisButtonText,
  }
}

// Кэш для данных контактов
let contactsDataCache: ContactsData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 минут

export async function getContactsData(): Promise<ContactsData> {
  // Проверяем кэш
  if (contactsDataCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return contactsDataCache
  }

  try {
    const { data, error } = await supabase
      .from('contacts_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching contacts data:', error)
      throw error
    }

    if (!data) {
      throw new Error('No contacts data found')
    }

    const transformedData = transformSupabaseToContactsData(data)
    
    // Обновляем кэш
    contactsDataCache = transformedData
    cacheTimestamp = Date.now()

    return transformedData
  } catch (error) {
    console.error('Error in getContactsData:', error)
    // Возвращаем кэшированные данные в случае ошибки
    if (contactsDataCache) {
      return contactsDataCache
    }
    throw error
  }
}

export async function saveContactsData(data: ContactsData): Promise<ContactsData> {
  try {
    // Преобразуем в формат Supabase
    const supabaseData = transformContactsDataToSupabase(data)

    // Сохраняем в базе данных
    const { data: result, error } = await supabase
      .from('contacts_data')
      .upsert(supabaseData)
      .select()
      .single()

    if (error) {
      console.error('Error saving contacts data:', error)
      throw error
    }

    const transformedData = transformSupabaseToContactsData(result)
    
    // Обновляем кэш
    contactsDataCache = transformedData
    cacheTimestamp = Date.now()

    return transformedData
  } catch (error) {
    console.error('Error in saveContactsData:', error)
    throw error
  }
}

// Функция для очистки кэша
export function clearContactsDataCache(): void {
  contactsDataCache = null
  cacheTimestamp = 0
}

// Функция для получения данных с принудительным обновлением
export async function refreshContactsData(): Promise<ContactsData> {
  clearContactsDataCache()
  return await getContactsData()
}

// Функция для миграции данных из localStorage
export async function migrateContactsDataFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem('contacts_data')
    if (!stored) return

    const localData = JSON.parse(stored)
    const supabaseData = transformContactsDataToSupabase(localData)

    const { error } = await supabase
      .from('contacts_data')
      .upsert(supabaseData)

    if (error) {
      console.error('Error migrating contacts data:', error)
      throw error
    }

    console.log('Contacts data migrated successfully')
  } catch (error) {
    console.error('Error in migrateContactsDataFromLocalStorage:', error)
    throw error
  }
}

// Функция для инициализации данных по умолчанию
export async function initializeDefaultContactsData(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('contacts_data')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Error checking existing data:', error)
      throw error
    }

    // Если данных нет, создаем дефолтные
    if (!data || data.length === 0) {
      const defaultData = {
        phone: '+7 (777) 323-17-15',
        email: 'info@baks.kz',
        address: 'Республика Казахстан, 050000, г. Астана',
        working_hours: {
          weekdays: '09:00 - 19:00',
          saturday: '10:00 - 16:00',
          sunday: 'Выходной',
        },
        whatsapp_numbers: {
          primary: '77773231715',
        },
        map_iframe: '',
        gis_link: 'https://yandex.kz/profile/100846790751',
        gis_button_text: 'Смотреть в Яндекс Картах',
      }

      const { error: insertError } = await supabase
        .from('contacts_data')
        .insert(defaultData)

      if (insertError) {
        console.error('Error inserting default data:', insertError)
        throw insertError
      }

      console.log('Default contacts data initialized')
    }
  } catch (error) {
    console.error('Error in initializeDefaultContactsData:', error)
    throw error
  }
}

// Функция для инициализации данных при первом запуске
export async function initializeContactsData(): Promise<void> {
  try {
    await initializeDefaultContactsData()
  } catch (error) {
    console.error('Error initializing contacts data:', error)
    throw error
  }
}
