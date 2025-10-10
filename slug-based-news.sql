-- =============================================
-- СИСТЕМА SLUG-BASED ID ДЛЯ НОВОСТЕЙ
-- =============================================

-- 1. Создаем функцию для генерации slug из заголовка
CREATE OR REPLACE FUNCTION generate_slug(title TEXT) RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(
                    regexp_replace(title, '[^а-яА-Яa-zA-Z0-9\s]', '', 'g'),
                    '\s+', '-', 'g'
                ),
                '^-+|-+$', '', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- 2. Создаем функцию для генерации уникального slug
CREATE OR REPLACE FUNCTION generate_unique_slug(title TEXT, table_name TEXT) RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    base_slug := generate_slug(title);
    final_slug := base_slug;
    
    -- Проверяем уникальность и добавляем число если нужно
    WHILE EXISTS (SELECT 1 FROM news_articles WHERE id = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 3. Удаляем старую таблицу если существует
DROP TABLE IF EXISTS news_articles CASCADE;

-- 4. Создаем новую таблицу с TEXT ID (slug)
CREATE TABLE news_articles (
    id TEXT PRIMARY KEY, -- Теперь ID это slug
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    content_image TEXT,
    content_sections JSONB DEFAULT '[]'::jsonb,
    published BOOLEAN DEFAULT false,
    show_on_homepage BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Создаем индексы
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published);
CREATE INDEX IF NOT EXISTS idx_news_homepage ON news_articles(show_on_homepage);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_by ON news_articles(created_by);

-- 6. Включаем RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- 7. Создаем политики
CREATE POLICY "Anyone can view published news" ON news_articles FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all news" ON news_articles FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can modify news" ON news_articles FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 8. Создаем триггер для updated_at
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Создаем триггер для автоматической генерации slug при вставке
CREATE OR REPLACE FUNCTION auto_generate_news_slug() RETURNS TRIGGER AS $$
BEGIN
    -- Если ID не указан или пустой, генерируем slug из заголовка
    IF NEW.id IS NULL OR NEW.id = '' THEN
        NEW.id := generate_unique_slug(NEW.title, 'news_articles');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_news_slug
    BEFORE INSERT ON news_articles
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_news_slug();

-- 10. Добавляем тестовые новости с красивыми slug
INSERT INTO news_articles (
    id, title, description, content, image, content_image, content_sections, published, show_on_homepage, created_by
) VALUES 
(
    'novye-kursy-obmena-povrezhdennyh-dollarov-ssha',
    'Новые курсы обмена поврежденных долларов США',
    'Обновили тарифы на обмен поврежденных банкнот долларов США. Теперь принимаем купюры с незначительными повреждениями по еще более выгодному курсу.',
    'С 15 декабря 2024 года вступают в силу новые, более выгодные тарифы на обмен поврежденных банкнот долларов США. Мы пересмотрели критерии оценки состояния купюр и теперь можем предложить лучшие условия для наших клиентов.

Банкноты с незначительными повреждениями (небольшие надрывы, потертости, загрязнения) теперь принимаются по курсу, максимально приближенному к курсу неповрежденных купюр. Это касается банкнот номиналом от $1 до $100.

Для банкнот с более серьезными повреждениями (крупные надрывы, отсутствие углов, сильные загрязнения) действуют специальные тарифы, которые все равно остаются выгодными для клиентов.

Мы также расширили список принимаемых валют и добавили новые услуги по оценке состояния банкнот.',
    '/news/damaged-dollars.jpg',
    '/news/damaged-dollars-content.jpg',
    '[
        {
            "title": "Новые тарифы",
            "text": "С 15 декабря 2024 года вступают в силу новые, более выгодные тарифы на обмен поврежденных банкнот долларов США."
        },
        {
            "title": "Критерии оценки",
            "text": "Мы пересмотрели критерии оценки состояния купюр и теперь можем предложить лучшие условия для наших клиентов."
        },
        {
            "title": "Принимаемые валюты",
            "text": "Мы также расширили список принимаемых валют и добавили новые услуги по оценке состояния банкнот."
        }
    ]'::jsonb,
    true,
    true,
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
),
(
    'rasshirenie-chasov-raboty-v-vyhodnye-dni',
    'Расширение часов работы в выходные дни',
    'С радостью сообщаем, что теперь мы работаем по субботам до 18:00! Это позволит нашим клиентам удобнее планировать визиты для обмена валют.',
    'Уважаемые клиенты! Мы рады сообщить о расширении часов работы в выходные дни.

Теперь по субботам мы работаем до 18:00, что позволит вам удобнее планировать визиты для обмена валют. Воскресенье остается выходным днем.

Новое расписание работы:
- Понедельник - Пятница: 09:00 - 19:00
- Суббота: 10:00 - 18:00
- Воскресенье: выходной

Мы также добавили возможность предварительной записи на консультацию по телефону или через WhatsApp.',
    '/news/extended-hours.jpg',
    '/news/extended-hours-content.jpg',
    '[
        {
            "title": "Новое расписание",
            "text": "Теперь по субботам мы работаем до 18:00, что позволит вам удобнее планировать визиты для обмена валют."
        },
        {
            "title": "Предварительная запись",
            "text": "Мы также добавили возможность предварительной записи на консультацию по телефону или через WhatsApp."
        }
    ]'::jsonb,
    true,
    true,
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
),
(
    'vvedenie-novyh-valyut-v-obmen',
    'Введение новых валют в обмен',
    'Теперь мы принимаем к обмену китайские юани (CNY) и японские иены (JPY). Это расширяет возможности для наших клиентов, работающих с азиатскими рынками.',
    'Мы продолжаем расширять список принимаемых валют для удобства наших клиентов.

С 1 января 2025 года мы начинаем принимать к обмену:
- Китайские юани (CNY)
- Японские иены (JPY)

Эти валюты особенно актуальны для клиентов, работающих с азиатскими рынками или планирующих поездки в Китай и Японию.

Курсы обмена обновляются ежедневно в соответствии с международными котировками. Мы гарантируем честные и прозрачные условия обмена для всех валют.',
    '/news/new-currencies.jpg',
    '/news/new-currencies-content.jpg',
    '[
        {
            "title": "Новые валюты",
            "text": "С 1 января 2025 года мы начинаем принимать к обмену китайские юани (CNY) и японские иены (JPY)."
        },
        {
            "title": "Актуальность",
            "text": "Эти валюты особенно актуальны для клиентов, работающих с азиатскими рынками или планирующих поездки в Китай и Японию."
        },
        {
            "title": "Честные условия",
            "text": "Курсы обмена обновляются ежедневно в соответствии с международными котировками. Мы гарантируем честные и прозрачные условия обмена для всех валют."
        }
    ]'::jsonb,
    true,
    false,
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1)
);

-- 11. Пересоздаем представления
CREATE OR REPLACE VIEW published_news AS
SELECT 
    na.*,
    u.username as author_username
FROM news_articles na
LEFT JOIN users u ON na.created_by = u.id
WHERE na.published = true
ORDER BY na.created_at DESC;

CREATE OR REPLACE VIEW homepage_news AS
SELECT 
    na.*,
    u.username as author_username
FROM news_articles na
LEFT JOIN users u ON na.created_by = u.id
WHERE na.published = true AND na.show_on_homepage = true
ORDER BY na.created_at DESC;

-- Сообщение об успешном выполнении
DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'НОВОСТИ ОБНОВЛЕНЫ НА SLUG-BASED ID';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Теперь URL новостей будут выглядеть как:';
    RAISE NOTICE '/news/novye-kursy-obmena-povrezhdennyh-dollarov-ssha';
    RAISE NOTICE '/news/rasshirenie-chasov-raboty-v-vyhodnye-dni';
    RAISE NOTICE '/news/vvedenie-novyh-valyut-v-obmen';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'При создании новых новостей slug генерируется автоматически!';
    RAISE NOTICE '=============================================';
END $$;

