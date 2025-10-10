-- =============================================
-- СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ ADMIN
-- =============================================

-- 1. Создаем пользователя admin
INSERT INTO users (id, username, password_hash, role, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin',
  'admin123',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 2. Проверяем, что пользователь создан
SELECT 
  id,
  username,
  role,
  created_at
FROM users 
WHERE username = 'admin';

-- Сообщение об успешном выполнении
DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ПОЛЬЗОВАТЕЛЬ ADMIN СОЗДАН/ОБНОВЛЕН';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Логин: admin';
    RAISE NOTICE 'Пароль: admin123';
    RAISE NOTICE '=============================================';
END $$;
