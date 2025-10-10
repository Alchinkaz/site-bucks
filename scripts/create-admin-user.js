const { createClient } = require('@supabase/supabase-js')

// Supabase конфигурация
const supabaseUrl = 'https://nmdsiqsidbqnpoiidqoo.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
  console.error('❌ Ошибка: Необходим SUPABASE_SERVICE_ROLE_KEY')
  console.log('Получите Service Role Key в Supabase Dashboard > Settings > API')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('🔐 Создание пользователя admin...')
    
    // Проверяем, существует ли уже пользователь admin
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .single()

    if (existingUser) {
      console.log('✅ Пользователь admin уже существует')
      console.log('ID:', existingUser.id)
      console.log('Username:', existingUser.username)
      console.log('Role:', existingUser.role)
      return
    }

    // Создаем нового пользователя
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: 'admin',
        password_hash: 'admin123',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Ошибка при создании пользователя:', error)
      return
    }

    console.log('✅ Пользователь admin успешно создан!')
    console.log('ID:', data.id)
    console.log('Username:', data.username)
    console.log('Role:', data.role)
    console.log('')
    console.log('🔑 Данные для входа:')
    console.log('Логин: admin')
    console.log('Пароль: admin123')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

createAdminUser()
