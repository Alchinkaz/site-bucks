# План миграции с localStorage на Supabase

## Анализ текущей структуры localStorage

### Данные, хранящиеся в localStorage:

1. **`homepage-data`** - данные главной страницы
   - Hero секция (заголовок, подзаголовок, кнопка, ссылка, изображение)
   - About секция (изображение, текст, описание)
   - Статистика (3 блока с заголовками и подзаголовками)
   - Отзывы (массив объектов)
   - Галерея изображений (массив объектов)
   - FAQ (массив вопросов-ответов)
   - Контакты (телефон, email, кнопка, ссылка, карта)
   - Курсы валют (массив объектов)
   - Тексты тикера (массив строк)

2. **`contacts_data`** - данные контактов
   - Телефон, email, адрес
   - Рабочие часы (объект)
   - WhatsApp номера (объект)
   - Карта (iframe)
   - Ссылки на 2GIS

3. **`admin_users`** - пользователи админки
   - ID, username, password, role, даты

4. **`admin_news`** - новости
   - ID, заголовок, описание, контент, изображения
   - Статусы публикации и показа на главной
   - Даты создания/обновления

5. **`admin_orders`** - заявки/заказы
   - ID, продукт, количество, контакты, статус, даты

6. **`admin_projects`** - проекты (если используются)
   - ID, заголовок, описание, контент, изображение
   - Статусы публикации

7. **`current_user`** - текущий пользователь
8. **`admin_token`** - токен авторизации

## Этапы миграции

### Этап 1: Подготовка инфраструктуры

1. **Создание Supabase проекта**
   - Выполнить SQL скрипт `supabase-migration.sql`
   - Настроить RLS политики
   - Создать API ключи

2. **Установка зависимостей**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Создание конфигурации Supabase**
   - Создать файл `lib/supabase.ts`
   - Настроить клиент с URL и ANON KEY

### Этап 2: Создание сервисов для работы с Supabase

1. **`lib/supabase-service.ts`** - основной сервис
   - Методы для работы с каждой таблицей
   - Обработка ошибок
   - Кэширование данных

2. **`lib/supabase-homepage.ts`** - сервис для главной страницы
   - Замена `lib/homepage-data.tsx`
   - Методы getHomepageData, updateHomepageData

3. **`lib/supabase-contacts.ts`** - сервис для контактов
   - Замена `lib/contacts-data.ts`
   - Методы getContactsData, saveContactsData

4. **`lib/supabase-news.ts`** - сервис для новостей
   - Замена `lib/news-data.ts`
   - Методы для CRUD операций с новостями

5. **`lib/supabase-admin.ts`** - сервис для админки
   - Замена `lib/admin-storage.ts`
   - Методы для пользователей, заказов, проектов

### Этап 3: Миграция данных

1. **Создание скрипта миграции данных**
   - `scripts/migrate-to-supabase.js`
   - Чтение данных из localStorage
   - Загрузка в Supabase
   - Валидация данных

2. **Выполнение миграции**
   - Запуск скрипта миграции
   - Проверка целостности данных
   - Резервное копирование

### Этап 4: Обновление компонентов

1. **Обновление импортов**
   - Замена импортов localStorage сервисов на Supabase
   - Обновление типов данных

2. **Обновление хуков и состояний**
   - Адаптация под асинхронную работу с Supabase
   - Обработка состояний загрузки

3. **Обновление админ панели**
   - Замена всех вызовов AdminStorage на Supabase
   - Обновление форм и валидации

### Этап 5: Тестирование и отладка

1. **Тестирование функциональности**
   - Проверка всех CRUD операций
   - Тестирование авторизации
   - Проверка RLS политик

2. **Оптимизация производительности**
   - Настройка кэширования
   - Оптимизация запросов
   - Настройка индексов

### Этап 6: Развертывание

1. **Обновление production**
   - Деплой обновленного кода
   - Миграция production данных
   - Мониторинг ошибок

2. **Очистка localStorage**
   - Удаление старых данных из localStorage
   - Обновление пользователей

## Детальный план реализации

### 1. Создание Supabase сервисов

#### `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nmdsiqsidbqnpoiidqoo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### `lib/supabase-homepage.ts`
```typescript
import { supabase } from './supabase'
import type { HomepageData } from './types'

export async function getHomepageData(): Promise<HomepageData> {
  const { data, error } = await supabase
    .from('homepage_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) throw error
  return data
}

export async function updateHomepageData(updates: Partial<HomepageData>): Promise<HomepageData> {
  // Implementation
}
```

### 2. Обновление компонентов

#### Замена в `app/page.tsx`
```typescript
// Было:
import { getHomepageData, updateHomepageData } from "@/lib/homepage-data"

// Стало:
import { getHomepageData, updateHomepageData } from "@/lib/supabase-homepage"
```

### 3. Обработка состояний загрузки

```typescript
const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getHomepageData()
      setHomepageData(data)
    } catch (error) {
      console.error('Error loading homepage data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  loadData()
}, [])
```

### 4. Миграция данных

#### Скрипт миграции `scripts/migrate-to-supabase.js`
```javascript
const { createClient } = require('@supabase/supabase-js')

async function migrateData() {
  // 1. Получить данные из localStorage
  const homepageData = JSON.parse(localStorage.getItem('homepage-data') || '{}')
  const contactsData = JSON.parse(localStorage.getItem('contacts_data') || '{}')
  const newsData = JSON.parse(localStorage.getItem('admin_news') || '[]')
  
  // 2. Загрузить в Supabase
  await supabase.from('homepage_data').upsert(homepageData)
  await supabase.from('contacts_data').upsert(contactsData)
  await supabase.from('news_articles').upsert(newsData)
}
```

## Преимущества миграции

1. **Централизованное хранение данных**
   - Все данные в одном месте
   - Синхронизация между устройствами
   - Резервное копирование

2. **Безопасность**
   - RLS политики
   - Аутентификация через Supabase Auth
   - Шифрование данных

3. **Масштабируемость**
   - Автоматическое масштабирование
   - CDN для статических файлов
   - Репликация данных

4. **Мониторинг и аналитика**
   - Логи запросов
   - Метрики производительности
   - Алерты

5. **API возможности**
   - REST API
   - GraphQL
   - Webhooks

## Риски и митигация

1. **Потеря данных**
   - Митигация: Полное резервное копирование перед миграцией

2. **Производительность**
   - Митигация: Кэширование, оптимизация запросов

3. **Совместимость**
   - Митигация: Постепенная миграция, fallback на localStorage

4. **Стоимость**
   - Митигация: Мониторинг использования, оптимизация запросов

## Временные рамки

- **Этап 1-2**: 2-3 дня (подготовка инфраструктуры)
- **Этап 3**: 1-2 дня (миграция данных)
- **Этап 4**: 3-4 дня (обновление компонентов)
- **Этап 5**: 2-3 дня (тестирование)
- **Этап 6**: 1 день (развертывание)

**Общее время**: 9-13 дней

## Следующие шаги

1. Выполнить SQL скрипт в Supabase
2. Создать базовые сервисы
3. Начать с миграции homepage данных
4. Постепенно мигрировать остальные модули
5. Тестировать каждый этап
6. Развернуть в production
