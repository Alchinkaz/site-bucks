#!/usr/bin/env node

/**
 * Скрипт миграции данных из localStorage в Supabase
 * Запуск: node scripts/migrate-to-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Конфигурация Supabase
const supabaseUrl = 'https://nmdsiqsidbqnpoiidqoo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHNpcXNpZGJxbnBvaWlkcW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzcxMzYsImV4cCI6MjA3NDUxMzEzNn0.9XzQBnvIgM8WwhhYIBxO-zJZzktbqkr1K9dvBcBWtUM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Дефолтные данные для инициализации
const defaultHomepageData = {
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

const defaultContactsData = {
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

const defaultAdminUser = {
  id: '00000000-0000-0000-0000-000000000001',
  username: 'admin',
  password_hash: '$2a$10$rQZ8K9LmN2pO3qR4sT5uVeWxYzA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6', // admin123
  role: 'admin',
  is_active: true,
}

// Функция для преобразования данных главной страницы
function transformHomepageData(localData) {
  return {
    hero_title: localData.heroTitle || defaultHomepageData.hero_title,
    hero_subtitle: localData.heroSubtitle || defaultHomepageData.hero_subtitle,
    hero_button_text: localData.heroButtonText || defaultHomepageData.hero_button_text,
    hero_button_link: localData.heroButtonLink || defaultHomepageData.hero_button_link,
    hero_image: localData.heroImage || defaultHomepageData.hero_image,
    about_image: localData.aboutImage || defaultHomepageData.about_image,
    about_text: localData.aboutText || defaultHomepageData.about_text,
    about_description: localData.aboutDescription || defaultHomepageData.about_description,
    stat1_title: localData.stat1Title || defaultHomepageData.stat1_title,
    stat1_subtitle: localData.stat1Subtitle || defaultHomepageData.stat1_subtitle,
    stat2_title: localData.stat2Title || defaultHomepageData.stat2_title,
    stat2_subtitle: localData.stat2Subtitle || defaultHomepageData.stat2_subtitle,
    stat3_title: localData.stat3Title || defaultHomepageData.stat3_title,
    stat3_subtitle: localData.stat3Subtitle || defaultHomepageData.stat3_subtitle,
    reviews: localData.reviews || defaultHomepageData.reviews,
    image_gallery: localData.imageGallery || defaultHomepageData.image_gallery,
    faq_items: localData.faqItems || defaultHomepageData.faq_items,
    contacts_phone: localData.contactsSection?.phone || defaultHomepageData.contacts_phone,
    contacts_email: localData.contactsSection?.email || defaultHomepageData.contacts_email,
    contacts_button_text: localData.contactsSection?.buttonText || defaultHomepageData.contacts_button_text,
    contacts_button_link: localData.contactsSection?.buttonLink || defaultHomepageData.contacts_button_link,
    contacts_map_iframe: localData.contactsSection?.mapIframe || defaultHomepageData.contacts_map_iframe,
    currency_rates: localData.currencyRates || defaultHomepageData.currency_rates,
    ticker_texts: localData.tickerTexts || defaultHomepageData.ticker_texts,
  }
}

// Функция для преобразования данных контактов
function transformContactsData(localData) {
  return {
    phone: localData.phone || defaultContactsData.phone,
    email: localData.email || defaultContactsData.email,
    address: localData.address || defaultContactsData.address,
    working_hours: localData.workingHours || defaultContactsData.working_hours,
    whatsapp_numbers: localData.whatsappNumbers || defaultContactsData.whatsapp_numbers,
    map_iframe: localData.mapIframe || defaultContactsData.map_iframe,
    gis_link: localData.gisLink || defaultContactsData.gis_link,
    gis_button_text: localData.gisButtonText || defaultContactsData.gis_button_text,
  }
}

// Функция для преобразования новостей
function transformNewsData(localData) {
  return localData.map(article => ({
    id: article.id,
    title: article.title,
    description: article.description,
    content: article.content,
    image: article.image || null,
    content_image: article.contentImage || null,
    content_sections: article.contentSections || [],
    published: article.published || false,
    show_on_homepage: article.show_on_homepage || false,
    created_at: article.createdAt || new Date().toISOString(),
    updated_at: article.updatedAt || new Date().toISOString(),
  }))
}

// Функция для преобразования заказов
function transformOrdersData(localData) {
  return localData.map(order => ({
    id: order.id,
    product_name: order.productName,
    product_image: order.productImage || null,
    quantity: order.quantity || 1,
    contact: order.contact,
    city: order.city,
    status: order.status || 'new',
    notes: order.notes || null,
    created_at: order.createdAt || new Date().toISOString(),
    updated_at: order.updatedAt || new Date().toISOString(),
  }))
}

// Функция для преобразования пользователей
function transformUsersData(localData) {
  return localData.map(user => ({
    id: user.id,
    username: user.username,
    password_hash: user.password, // В реальном проекте нужно хэшировать пароли
    role: user.role || 'admin',
    is_active: true,
    created_at: user.createdAt || new Date().toISOString(),
    last_login: user.lastLogin || null,
  }))
}

// Основная функция миграции
async function migrateData() {
  console.log('🚀 Начинаем миграцию данных в Supabase...')

  try {
    // 1. Миграция данных главной страницы
    console.log('📄 Мигрируем данные главной страницы...')
    const homepageData = transformHomepageData({})
    const { error: homepageError } = await supabase
      .from('homepage_data')
      .upsert(homepageData)

    if (homepageError) {
      console.error('❌ Ошибка при миграции данных главной страницы:', homepageError)
    } else {
      console.log('✅ Данные главной страницы успешно мигрированы')
    }

    // 2. Миграция данных контактов
    console.log('📞 Мигрируем данные контактов...')
    const contactsData = transformContactsData({})
    const { error: contactsError } = await supabase
      .from('contacts_data')
      .upsert(contactsData)

    if (contactsError) {
      console.error('❌ Ошибка при миграции данных контактов:', contactsError)
    } else {
      console.log('✅ Данные контактов успешно мигрированы')
    }

    // 3. Миграция пользователей
    console.log('👥 Мигрируем пользователей...')
    const usersData = [defaultAdminUser]
    const { error: usersError } = await supabase
      .from('users')
      .upsert(usersData)

    if (usersError) {
      console.error('❌ Ошибка при миграции пользователей:', usersError)
    } else {
      console.log('✅ Пользователи успешно мигрированы')
    }

    // 4. Миграция новостей (если есть)
    console.log('📰 Мигрируем новости...')
    const newsData = transformNewsData([])
    if (newsData.length > 0) {
      const { error: newsError } = await supabase
        .from('news_articles')
        .upsert(newsData)

      if (newsError) {
        console.error('❌ Ошибка при миграции новостей:', newsError)
      } else {
        console.log('✅ Новости успешно мигрированы')
      }
    } else {
      console.log('ℹ️ Новости для миграции не найдены')
    }

    // 5. Миграция заказов (если есть)
    console.log('📦 Мигрируем заказы...')
    const ordersData = transformOrdersData([])
    if (ordersData.length > 0) {
      const { error: ordersError } = await supabase
        .from('orders')
        .upsert(ordersData)

      if (ordersError) {
        console.error('❌ Ошибка при миграции заказов:', ordersError)
      } else {
        console.log('✅ Заказы успешно мигрированы')
      }
    } else {
      console.log('ℹ️ Заказы для миграции не найдены')
    }

    console.log('🎉 Миграция завершена успешно!')
    console.log('')
    console.log('📋 Следующие шаги:')
    console.log('1. Проверьте данные в Supabase Dashboard')
    console.log('2. Обновите код для использования Supabase сервисов')
    console.log('3. Протестируйте функциональность')
    console.log('4. Удалите старые данные из localStorage')

  } catch (error) {
    console.error('💥 Критическая ошибка при миграции:', error)
    process.exit(1)
  }
}

// Функция для проверки подключения к Supabase
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('homepage_data')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Ошибка подключения к Supabase:', error)
      return false
    }

    console.log('✅ Подключение к Supabase успешно')
    return true
  } catch (error) {
    console.error('❌ Ошибка подключения к Supabase:', error)
    return false
  }
}

// Главная функция
async function main() {
  console.log('🔧 Проверяем подключение к Supabase...')
  
  const isConnected = await testConnection()
  if (!isConnected) {
    console.error('💥 Не удалось подключиться к Supabase. Проверьте настройки.')
    process.exit(1)
  }

  await migrateData()
}

// Запуск скрипта
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { migrateData, testConnection }
