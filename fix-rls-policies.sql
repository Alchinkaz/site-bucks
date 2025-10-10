-- Исправление RLS политик для homepage_data таблицы
-- Разрешаем всем пользователям читать данные
DROP POLICY IF EXISTS "Allow public read access to homepage_data" ON homepage_data;
CREATE POLICY "Allow public read access to homepage_data" ON homepage_data
  FOR SELECT USING (true);

-- Разрешаем всем пользователям обновлять данные (для админ панели)
DROP POLICY IF EXISTS "Allow public update access to homepage_data" ON homepage_data;
CREATE POLICY "Allow public update access to homepage_data" ON homepage_data
  FOR UPDATE USING (true);

-- Разрешаем всем пользователям вставлять данные
DROP POLICY IF EXISTS "Allow public insert access to homepage_data" ON homepage_data;
CREATE POLICY "Allow public insert access to homepage_data" ON homepage_data
  FOR INSERT WITH CHECK (true);

-- Исправление RLS политик для contacts_data таблицы
DROP POLICY IF EXISTS "Allow public read access to contacts_data" ON contacts_data;
CREATE POLICY "Allow public read access to contacts_data" ON contacts_data
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update access to contacts_data" ON contacts_data;
CREATE POLICY "Allow public update access to contacts_data" ON contacts_data
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public insert access to contacts_data" ON contacts_data;
CREATE POLICY "Allow public insert access to contacts_data" ON contacts_data
  FOR INSERT WITH CHECK (true);

-- Исправление RLS политик для news_articles таблицы
DROP POLICY IF EXISTS "Allow public read access to news_articles" ON news_articles;
CREATE POLICY "Allow public read access to news_articles" ON news_articles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update access to news_articles" ON news_articles;
CREATE POLICY "Allow public update access to news_articles" ON news_articles
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public insert access to news_articles" ON news_articles;
CREATE POLICY "Allow public insert access to news_articles" ON news_articles
  FOR INSERT WITH CHECK (true);

-- Исправление RLS политик для users таблицы
DROP POLICY IF EXISTS "Allow public read access to users" ON users;
CREATE POLICY "Allow public read access to users" ON users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update access to users" ON users;
CREATE POLICY "Allow public update access to users" ON users
  FOR UPDATE USING (true);

-- Убеждаемся что RLS включен для всех таблиц
ALTER TABLE homepage_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
