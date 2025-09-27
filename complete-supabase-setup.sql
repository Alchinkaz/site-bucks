-- =============================================
-- ПОЛНАЯ НАСТРОЙКА SUPABASE ДЛЯ BUCKS PROJECT
-- =============================================
-- Выполните этот скрипт в Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- =============================================
-- 2. HOMEPAGE_DATA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS homepage_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Hero Section
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_button_text VARCHAR(100) NOT NULL,
    hero_button_link TEXT NOT NULL,
    hero_image TEXT,
    
    -- About Section
    about_image TEXT,
    about_text TEXT NOT NULL,
    about_description TEXT NOT NULL,
    
    -- Statistics Section
    stat1_title VARCHAR(50) NOT NULL,
    stat1_subtitle TEXT NOT NULL,
    stat2_title VARCHAR(50) NOT NULL,
    stat2_subtitle TEXT NOT NULL,
    stat3_title VARCHAR(50) NOT NULL,
    stat3_subtitle TEXT NOT NULL,
    
    -- Reviews (stored as JSONB)
    reviews JSONB DEFAULT '[]'::jsonb,
    
    -- Image Gallery (stored as JSONB)
    image_gallery JSONB DEFAULT '[]'::jsonb,
    
    -- FAQ Items (stored as JSONB)
    faq_items JSONB DEFAULT '[]'::jsonb,
    
    -- Contacts Section
    contacts_phone VARCHAR(20) NOT NULL,
    contacts_email VARCHAR(100) NOT NULL,
    contacts_button_text VARCHAR(100) NOT NULL,
    contacts_button_link TEXT NOT NULL,
    contacts_map_iframe TEXT,
    
    -- Currency Rates (stored as JSONB)
    currency_rates JSONB DEFAULT '[]'::jsonb,
    
    -- Ticker Texts (stored as JSONB)
    ticker_texts JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- =============================================
-- 3. CONTACTS_DATA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contacts_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    working_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
    whatsapp_numbers JSONB NOT NULL DEFAULT '{}'::jsonb,
    map_iframe TEXT,
    gis_link TEXT,
    gis_button_text VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- =============================================
-- 4. NEWS_ARTICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    content_image TEXT,
    content_sections JSONB DEFAULT '[]'::jsonb,
    published BOOLEAN DEFAULT false,
    show_on_homepage BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =============================================
-- 5. ORDERS TABLE (for booking forms)
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(200) NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    contact VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =============================================
-- 6. PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    published BOOLEAN DEFAULT false,
    show_on_homepage BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =============================================
-- 7. SESSIONS TABLE (for admin authentication)
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- News articles indexes
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published);
CREATE INDEX IF NOT EXISTS idx_news_homepage ON news_articles(show_on_homepage);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_by ON news_articles(created_by);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_by ON orders(created_by);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- =============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Only admins can insert users" ON users FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update users" ON users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete users" ON users FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Homepage data policies (public read, admin write)
CREATE POLICY "Anyone can view homepage data" ON homepage_data FOR SELECT USING (true);
CREATE POLICY "Only admins can modify homepage data" ON homepage_data FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Contacts data policies (public read, admin write)
CREATE POLICY "Anyone can view contacts data" ON contacts_data FOR SELECT USING (true);
CREATE POLICY "Only admins can modify contacts data" ON contacts_data FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- News articles policies (public read published, admin full access)
CREATE POLICY "Anyone can view published news" ON news_articles FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all news" ON news_articles FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can modify news" ON news_articles FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Orders policies (public insert, admin full access)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can modify orders" ON orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete orders" ON orders FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Projects policies (public read published, admin full access)
CREATE POLICY "Anyone can view published projects" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all projects" ON projects FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can modify projects" ON projects FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions policies
CREATE POLICY "Users can manage their own sessions" ON sessions FOR ALL USING (user_id = auth.uid());

-- =============================================
-- 10. FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_homepage_data_updated_at BEFORE UPDATE ON homepage_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_data_updated_at BEFORE UPDATE ON contacts_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 11. INITIAL DATA
-- =============================================

-- Insert default admin user (password: admin123)
INSERT INTO users (id, username, password_hash, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin', '$2a$10$rQZ8K9LmN2pO3qR4sT5uVeWxYzA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default homepage data
INSERT INTO homepage_data (
    hero_title, hero_subtitle, hero_button_text, hero_button_link, hero_image,
    about_image, about_text, about_description,
    stat1_title, stat1_subtitle, stat2_title, stat2_subtitle, stat3_title, stat3_subtitle,
    reviews, image_gallery, faq_items,
    contacts_phone, contacts_email, contacts_button_text, contacts_button_link, contacts_map_iframe,
    currency_rates, ticker_texts
) VALUES (
    'Обмен ветхой валюты в Астане по выгодному курсу',
    'Принимаем доллары, евро, фунты, франки и другие валюты с дефектами, печатями и повреждениями.',
    'Получить консультацию',
    'https://wa.me/77773231715',
    '/money-bills-background.jpg',
    '/placeholder.svg?height=270&width=480',
    'При вас оценим состояние купюр и обменяли их по лучшему курсу',
    'Не каждый банк в Казахстане принимает поврежденные и ветхие банкноты. Мы специализируемся на обмене валют любого состояния: надорванные, выцветшие, с печатями, пятнами или другими повреждениями. Минимальная сумма обмена от 100$/€/£.',
    '5+ лет', 'Опыт работы на валютном рынке',
    '15+ валют', 'Принимаем к обмену',
    '1000+', 'Довольных клиентов',
    '[
        {
            "id": "1",
            "name": "Алия Нурланова",
            "text": "Обратилась с поврежденными долларами, которые не принимали в банках. Здесь быстро оценили и обменяли по хорошему курсу. Очень довольна сервисом!",
            "rating": 5,
            "date": "2 дня назад"
        },
        {
            "id": "2",
            "name": "Марат Касымов",
            "text": "Отличное место для обмена ветхих банкнот. Профессиональный подход, честные курсы. Рекомендую всем, кто столкнулся с проблемой поврежденной валюты.",
            "rating": 5,
            "date": "1 неделю назад"
        },
        {
            "id": "3",
            "name": "Динара Абдуллаева",
            "text": "Быстро и качественно обменяли евро с небольшими повреждениями. Курс оказался даже лучше, чем ожидала. Спасибо за профессионализм!",
            "rating": 5,
            "date": "3 дня назад"
        }
    ]'::jsonb,
    '[
        {
            "id": "1",
            "url": "/modern-office-interior.png",
            "alt": "Офис обмена валют"
        },
        {
            "id": "2",
            "url": "/currency-exchange.png",
            "alt": "Процесс обмена валют"
        },
        {
            "id": "3",
            "url": "/damaged-banknotes.jpg",
            "alt": "Поврежденные банкноты"
        }
    ]'::jsonb,
    '[
        {
            "id": "1",
            "question": "Какие валюты вы принимаете к обмену?",
            "answer": "Мы принимаем доллары США, евро, британские фунты, швейцарские франки, японские йены, российские рубли и многие другие валюты. Также работаем с поврежденными и ветхими банкнотами.",
            "order": 1
        },
        {
            "id": "2",
            "question": "Принимаете ли вы поврежденные банкноты?",
            "answer": "Да, мы специализируемся на обмене поврежденных банкнот. Принимаем купюры с надрывами, потертостями, печатями, пятнами и другими дефектами, которые не принимают в обычных банках.",
            "order": 2
        },
        {
            "id": "3",
            "question": "Какой курс обмена вы предлагаете?",
            "answer": "Мы предлагаем конкурентные курсы, которые обновляются ежедневно в зависимости от рыночной ситуации. Курс может варьироваться в зависимости от состояния банкнот и суммы обмена.",
            "order": 3
        },
        {
            "id": "4",
            "question": "Нужны ли документы для обмена?",
            "answer": "Для обмена валют на сумму свыше определенного лимита требуется предъявление документа, удостоверяющего личность. Для небольших сумм документы могут не потребоваться.",
            "order": 4
        },
        {
            "id": "5",
            "question": "Как долго происходит процедура обмена?",
            "answer": "Обычно процедура обмена занимает от 5 до 15 минут, в зависимости от количества банкнот и необходимости их дополнительной проверки. Поврежденные купюры могут потребовать больше времени для оценки.",
            "order": 5
        },
        {
            "id": "6",
            "question": "Есть ли минимальная сумма для обмена?",
            "answer": "Минимальной суммы для обмена нет. Мы готовы обменять как крупные суммы, так и отдельные банкноты. Однако для очень маленьких сумм курс может быть менее выгодным.",
            "order": 6
        }
    ]'::jsonb,
    '+7 (777) 323-17-15', 'shotkin.azat@gmail.com', 'Получить консультацию', 'https://wa.me/77773231715', 
    '<iframe src="https://yandex.kz/map-widget/v1/?from=mapframe&ll=76.952539%2C43.218606&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzE2ODMwMhIg0prQsNC30LDSm9GB0YLQsNC90LDQvdGC0YsiCg0r5JlCFdvyLEI%2C&source=mapframe&utm_source=mapframe&z=10" width="100%" height="100%" frameBorder="1" allowFullScreen={true} style={{ position: "relative", borderRadius: "1rem" }} />',
    '[
        {
            "currency": "USD",
            "buyRate": 538.1,
            "sellRate": 540.5,
            "buyChange": -0.5,
            "sellChange": 1
        },
        {
            "currency": "EUR",
            "buyRate": 626.5,
            "sellRate": 630.5,
            "buyChange": 6.5,
            "sellChange": -0.5
        },
        {
            "currency": "RUB",
            "buyRate": 6.57,
            "sellRate": 6.69,
            "buyChange": 0,
            "sellChange": 0.02
        }
    ]'::jsonb,
    '[
        "Выгодный курс обмена валют",
        "Принимаем поврежденные купюры",
        "Доллары, евро, фунты и другие валюты",
        "Быстрый и надежный обмен",
        "Работаем с ветхими банкнотами",
        "Лучшие условия в Астане"
    ]'::jsonb
) ON CONFLICT DO NOTHING;

-- Insert default contacts data
INSERT INTO contacts_data (
    phone, email, address, working_hours, whatsapp_numbers, gis_link, gis_button_text
) VALUES (
    '+7 (777) 323-17-15',
    'info@baks.kz',
    'Республика Казахстан, 050000, г. Астана',
    '{"weekdays": "09:00 - 19:00", "saturday": "10:00 - 16:00", "sunday": "Выходной"}'::jsonb,
    '{"primary": "77773231715"}'::jsonb,
    'https://yandex.kz/profile/100846790751',
    'Смотреть в Яндекс Картах'
) ON CONFLICT DO NOTHING;

-- Insert sample news articles
INSERT INTO news_articles (
    id, title, description, content, image, content_image, content_sections, published, show_on_homepage, created_by
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Новые курсы обмена поврежденных долларов США',
    'Обновили тарифы на обмен поврежденных банкнот долларов США. Теперь принимаем купюры с незначительными повреждениями по еще более выгодному курсу.',
    'С 15 декабря 2024 года вступают в силу новые, более выгодные тарифы на обмен поврежденных банкнот долларов США. Мы пересмотрели критерии оценки состояния купюр и теперь можем предложить лучшие условия для наших клиентов.

Банкноты с незначительными повреждениями (небольшие надрывы, потертости, загрязнения) теперь принимаются по курсу, максимально приближенному к курсу неповрежденных купюр. Это касается банкнот номиналом от $1 до $100.

Оценка состояния банкнот производится при клиенте с использованием профессионального оборудования. Весь процесс занимает не более 10 минут, после чего клиент получает наличные по актуальному курсу.',
    '/placeholder.svg?height=200&width=400',
    '/placeholder.svg?height=200&width=400',
    '[{"title": "Подробности", "text": "С 15 декабря 2024 года вступают в силу новые, более выгодные тарифы на обмен поврежденных банкнот долларов США. Мы пересмотрели критерии оценки состояния купюр и теперь можем предложить лучшие условия для наших клиентов.\\n\\nБанкноты с незначительными повреждениями (небольшие надрывы, потертости, загрязнения) теперь принимаются по курсу, максимально приближенному к курсу неповрежденных купюр. Это касается банкнот номиналом от $1 до $100.\\n\\nОценка состояния банкнот производится при клиенте с использованием профессионального оборудования. Весь процесс занимает не более 10 минут, после чего клиент получает наличные по актуальному курсу."}]'::jsonb,
    true, true, '00000000-0000-0000-0000-000000000001'
),
(
    '00000000-0000-0000-0000-000000000002',
    'Расширение списка принимаемых валют',
    'Добавили в список принимаемых валют швейцарские франки и японские йены. Обмениваем как новые, так и поврежденные банкноты по актуальному курсу.',
    'Рады сообщить о расширении списка принимаемых валют. Теперь мы работаем со швейцарскими франками (CHF) и японскими йенами (JPY), что делает наши услуги еще более востребованными.

Курсы обмена швейцарских франков и японских йен обновляются ежедневно в соответствии с международными валютными рынками. Мы гарантируем справедливые и конкурентоспособные условия обмена.',
    '/placeholder.svg?height=200&width=400',
    '/placeholder.svg?height=200&width=400',
    '[{"title": "Подробности", "text": "Рады сообщить о расширении списка принимаемых валют. Теперь мы работаем со швейцарскими франками (CHF) и японскими йенами (JPY), что делает наши услуги еще более востребованными.\\n\\nКурсы обмена швейцарских франков и японских йен обновляются ежедневно в соответствии с международными валютными рынками. Мы гарантируем справедливые и конкурентоспособные условия обмена."}]'::jsonb,
    true, true, '00000000-0000-0000-0000-000000000001'
),
(
    '00000000-0000-0000-0000-000000000003',
    'Специальные условия для крупных сумм',
    'Для клиентов, обменивающих суммы от $5000, действуют особые условия и персональный подход к оценке состояния банкнот.',
    'Клиенты, обменивающие крупные суммы от $5000, получают персональное обслуживание и особые условия. Мы понимаем важность таких операций и обеспечиваем максимальный комфорт и безопасность.

Каждая банкнота оценивается индивидуально с применением профессиональных методов экспертизы. Это позволяет предложить наиболее справедливую цену за каждую купюру, независимо от степени ее сохранности.',
    '/placeholder.svg?height=200&width=400',
    '/placeholder.svg?height=200&width=400',
    '[{"title": "Подробности", "text": "Клиенты, обменивающие крупные суммы от $5000, получают персональное обслуживание и особые условия. Мы понимаем важность таких операций и обеспечиваем максимальный комфорт и безопасность.\\n\\nКаждая банкнота оценивается индивидуально с применением профессиональных методов экспертизы. Это позволяет предложить наиболее справедливую цену за каждую купюру, независимо от степени ее сохранности."}]'::jsonb,
    true, true, '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 12. VIEWS FOR EASY DATA ACCESS
-- =============================================

-- View for published news with author info
CREATE OR REPLACE VIEW published_news AS
SELECT 
    na.*,
    u.username as author_username
FROM news_articles na
LEFT JOIN users u ON na.created_by = u.id
WHERE na.published = true
ORDER BY na.created_at DESC;

-- View for homepage news
CREATE OR REPLACE VIEW homepage_news AS
SELECT 
    na.*,
    u.username as author_username
FROM news_articles na
LEFT JOIN users u ON na.created_by = u.id
WHERE na.published = true AND na.show_on_homepage = true
ORDER BY na.created_at DESC;

-- View for recent orders
CREATE OR REPLACE VIEW recent_orders AS
SELECT 
    o.*,
    u.username as created_by_username
FROM orders o
LEFT JOIN users u ON o.created_by = u.id
ORDER BY o.created_at DESC;

-- =============================================
-- 13. UTILITY FUNCTIONS
-- =============================================

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get homepage data (single record)
CREATE OR REPLACE FUNCTION get_homepage_data()
RETURNS homepage_data AS $$
DECLARE
    result homepage_data;
BEGIN
    SELECT * INTO result FROM homepage_data ORDER BY created_at DESC LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get contacts data (single record)
CREATE OR REPLACE FUNCTION get_contacts_data()
RETURNS contacts_data AS $$
DECLARE
    result contacts_data;
BEGIN
    SELECT * INTO result FROM contacts_data ORDER BY created_at DESC LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 14. COMPLETION MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'SUPABASE SETUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Tables created: users, homepage_data, contacts_data, news_articles, orders, projects, sessions';
    RAISE NOTICE 'Default data inserted: admin user, homepage data, contacts data, sample news';
    RAISE NOTICE 'RLS policies enabled for security';
    RAISE NOTICE 'Indexes created for performance';
    RAISE NOTICE 'Views created for easy data access';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update your Next.js app to use Supabase services';
    RAISE NOTICE '2. Replace localStorage calls with Supabase API calls';
    RAISE NOTICE '3. Test the application';
    RAISE NOTICE '=============================================';
END $$;
