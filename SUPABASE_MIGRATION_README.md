# Миграция с localStorage на Supabase

## Обзор

Этот проект мигрирует с локального хранения данных (localStorage) на Supabase - облачную базу данных PostgreSQL с встроенной аутентификацией и API.

## Структура данных

### Текущие данные в localStorage:
- `homepage-data` - данные главной страницы
- `contacts_data` - контактная информация
- `admin_users` - пользователи админки
- `admin_news` - новости
- `admin_orders` - заявки/заказы
- `admin_projects` - проекты
- `current_user` - текущий пользователь
- `admin_token` - токен авторизации

### Новые таблицы в Supabase:
- `users` - пользователи системы
- `homepage_data` - данные главной страницы
- `contacts_data` - контактная информация
- `news_articles` - новости
- `orders` - заявки/заказы
- `projects` - проекты
- `sessions` - сессии пользователей

## Файлы миграции

### 1. SQL схема
- `supabase-migration.sql` - полная SQL схема для создания таблиц, индексов, RLS политик

### 2. Supabase сервисы
- `lib/supabase.ts` - конфигурация клиента Supabase
- `lib/supabase-homepage.ts` - сервис для работы с главной страницей
- `lib/supabase-contacts.ts` - сервис для работы с контактами

### 3. Скрипт миграции
- `scripts/migrate-to-supabase.js` - скрипт для миграции данных

### 4. Документация
- `MIGRATION_PLAN.md` - детальный план миграции
- `SUPABASE_MIGRATION_README.md` - этот файл

## Пошаговая инструкция

### Шаг 1: Подготовка Supabase

1. Выполните SQL скрипт в Supabase Dashboard:
   ```sql
   -- Скопируйте и выполните содержимое файла supabase-migration.sql
   ```

2. Проверьте создание таблиц в разделе "Table Editor"

### Шаг 2: Установка зависимостей

```bash
npm install @supabase/supabase-js
```

### Шаг 3: Выполнение миграции данных

```bash
npm run migrate
```

### Шаг 4: Обновление кода

Замените импорты в компонентах:

```typescript
// Было:
import { getHomepageData, updateHomepageData } from "@/lib/homepage-data"
import { getContactsData, saveContactsData } from "@/lib/contacts-data"

// Стало:
import { getHomepageData, updateHomepageData } from "@/lib/supabase-homepage"
import { getContactsData, saveContactsData } from "@/lib/supabase-contacts"
```

### Шаг 5: Обновление компонентов

Добавьте обработку состояний загрузки:

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
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  loadData()
}, [])
```

## Конфигурация

### Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nmdsiqsidbqnpoiidqoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Обновление lib/supabase.ts

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Безопасность

### RLS (Row Level Security) политики

Все таблицы защищены RLS политиками:

- **Публичный доступ**: `homepage_data`, `contacts_data` (только чтение)
- **Админ доступ**: все таблицы для записи/обновления
- **Пользовательский доступ**: `orders` (создание), `sessions` (управление своими сессиями)

### Аутентификация

- Используйте Supabase Auth для аутентификации
- Сессии хранятся в таблице `sessions`
- Токены имеют срок действия

## Мониторинг и отладка

### Логи Supabase

1. Откройте Supabase Dashboard
2. Перейдите в раздел "Logs"
3. Выберите "API" для просмотра запросов

### Отладка в коде

```typescript
// Включите отладку
const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
})

// Логирование запросов
console.log('Supabase response:', data, error)
```

## Производительность

### Кэширование

Сервисы включают встроенное кэширование:
- `homepage_data` - 5 минут
- `contacts_data` - 10 минут

### Оптимизация запросов

- Используйте `select()` для выбора только нужных полей
- Применяйте `limit()` для ограничения результатов
- Используйте индексы для часто запрашиваемых полей

## Откат изменений

Если нужно вернуться к localStorage:

1. Замените импорты обратно на localStorage сервисы
2. Удалите Supabase зависимости
3. Восстановите данные из резервной копии localStorage

## Поддержка

### Частые проблемы

1. **Ошибка подключения к Supabase**
   - Проверьте URL и ключ
   - Убедитесь, что RLS политики настроены правильно

2. **Данные не загружаются**
   - Проверьте консоль браузера на ошибки
   - Убедитесь, что таблицы созданы

3. **Ошибки авторизации**
   - Проверьте RLS политики
   - Убедитесь, что пользователь аутентифицирован

### Логи и отладка

```typescript
// Включите подробные логи
const supabase = createClient(url, key, {
  auth: {
    debug: true,
    logger: (level, message, data) => {
      console.log(`[${level}] ${message}`, data)
    }
  }
})
```

## Следующие шаги

1. ✅ Выполните SQL миграцию
2. ✅ Установите зависимости
3. ✅ Запустите скрипт миграции
4. 🔄 Обновите компоненты для использования Supabase
5. 🔄 Протестируйте функциональность
6. 🔄 Разверните в production
7. 🔄 Очистите localStorage

## Контакты

При возникновении проблем:
- Проверьте логи в Supabase Dashboard
- Изучите документацию Supabase
- Создайте issue в репозитории проекта
