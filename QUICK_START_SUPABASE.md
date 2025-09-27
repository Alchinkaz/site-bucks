# 🚀 БЫСТРЫЙ ПЕРЕХОД НА SUPABASE

## Шаг 1: Выполните SQL скрипт

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Скопируйте и выполните содержимое файла `complete-supabase-setup.sql`

## Шаг 2: Запустите миграцию

```bash
npm install @supabase/supabase-js
npm run migrate:complete
```

## Шаг 3: Обновите код

### Замените импорты в компонентах:

**В файле `app/page.tsx`:**
```typescript
// Было:
import { getHomepageData, updateHomepageData } from "@/lib/homepage-data"

// Стало:
import { getHomepageData, updateHomepageData } from "@/lib/supabase-homepage"
```

**В файле `app/contacts/page.tsx`:**
```typescript
// Было:
import { getContactsData, saveContactsData } from "@/lib/contacts-data"

// Стало:
import { getContactsData, saveContactsData } from "@/lib/supabase-contacts"
```

**В файле `app/news/page.tsx`:**
```typescript
// Было:
import { getAllNews, getPublishedNews } from "@/lib/news-data"

// Стало:
import { getNewsArticles, getPublishedNews } from "@/lib/supabase-news"
```

**В админ панели:**
```typescript
// Было:
import { AdminStorage } from "@/lib/admin-storage"

// Стало:
import * as AdminService from "@/lib/supabase-admin"
```

### Обновите компоненты для асинхронной работы:

```typescript
// Пример обновления компонента
const [homepageData, setHomepageData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getHomepageData()
      setHomepageData(data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  loadData()
}, [])

if (loading) return <div>Загрузка...</div>
if (!homepageData) return <div>Ошибка загрузки</div>
```

## Шаг 4: Протестируйте

1. Запустите `npm run dev`
2. Проверьте главную страницу
3. Проверьте админ панель
4. Проверьте создание/редактирование новостей

## ✅ Готово!

Теперь ваш проект полностью работает с Supabase вместо localStorage.

## 🆘 Если что-то не работает:

1. Проверьте консоль браузера
2. Проверьте Supabase Dashboard → Logs
3. Убедитесь, что SQL скрипт выполнен полностью
4. Проверьте файл `.env.local`

## 📁 Созданные файлы:

- `complete-supabase-setup.sql` - SQL скрипт для Supabase
- `lib/supabase.ts` - конфигурация клиента
- `lib/supabase-homepage.ts` - сервис главной страницы
- `lib/supabase-contacts.ts` - сервис контактов
- `lib/supabase-news.ts` - сервис новостей
- `lib/supabase-admin.ts` - сервис админки
- `scripts/complete-migration.js` - скрипт миграции
