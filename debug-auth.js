const { createClient } = require('@supabase/supabase-js')

// Supabase конфигурация
const supabaseUrl = 'https://nmdsiqsidbqnpoiidqoo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHNpcXNpZGJxbnBvaWlkcW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzcxMzYsImV4cCI6MjA3NDUxMzEzNn0.9XzQBnvIgM8WwhhYIBxO-zJZzktbqkr1K9dvBcBWtUM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugAuth() {
  try {
    console.log('🔍 Проверяем подключение к Supabase...')
    
    // 1. Проверяем подключение
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Ошибка подключения к Supabase:', testError)
      return
    }
    
    console.log('✅ Подключение к Supabase успешно')
    
    // 2. Проверяем существование пользователя admin
    console.log('🔍 Проверяем пользователя admin...')
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .single()
    
    if (userError && userError.code !== 'PGRST116') {
      console.error('❌ Ошибка при поиске пользователя:', userError)
      return
    }
    
    if (existingUser) {
      console.log('✅ Пользователь admin найден:')
      console.log('  ID:', existingUser.id)
      console.log('  Username:', existingUser.username)
      console.log('  Role:', existingUser.role)
      console.log('  Password hash:', existingUser.password_hash)
      console.log('  Created at:', existingUser.created_at)
    } else {
      console.log('❌ Пользователь admin не найден, создаем...')
      
      // 3. Создаем пользователя admin
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          id: '00000000-0000-0000-0000-000000000001',
          username: 'admin',
          password_hash: 'admin123',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (createError) {
        console.error('❌ Ошибка при создании пользователя:', createError)
        return
      }
      
      console.log('✅ Пользователь admin создан:')
      console.log('  ID:', newUser.id)
      console.log('  Username:', newUser.username)
      console.log('  Role:', newUser.role)
    }
    
    // 4. Тестируем аутентификацию
    console.log('🔍 Тестируем аутентификацию...')
    const { data: authUser, error: authError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .single()
    
    if (authError) {
      console.error('❌ Ошибка при аутентификации:', authError)
      return
    }
    
    if (authUser.password_hash === 'admin123') {
      console.log('✅ Аутентификация успешна!')
      console.log('  Логин: admin')
      console.log('  Пароль: admin123')
    } else {
      console.log('❌ Пароль не совпадает')
    }
    
  } catch (error) {
    console.error('❌ Общая ошибка:', error)
  }
}

debugAuth()
