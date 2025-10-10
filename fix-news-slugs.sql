-- Скрипт для исправления русских slug в новостях
-- Этот скрипт обновит существующие новости с русскими URL на транслитерированные

-- Функция транслитерации для SQL
CREATE OR REPLACE FUNCTION transliterate_russian_to_english(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT := input_text;
BEGIN
    -- Транслитерация русских букв в английские
    result := replace(result, 'а', 'a');
    result := replace(result, 'б', 'b');
    result := replace(result, 'в', 'v');
    result := replace(result, 'г', 'g');
    result := replace(result, 'д', 'd');
    result := replace(result, 'е', 'e');
    result := replace(result, 'ё', 'yo');
    result := replace(result, 'ж', 'zh');
    result := replace(result, 'з', 'z');
    result := replace(result, 'и', 'i');
    result := replace(result, 'й', 'y');
    result := replace(result, 'к', 'k');
    result := replace(result, 'л', 'l');
    result := replace(result, 'м', 'm');
    result := replace(result, 'н', 'n');
    result := replace(result, 'о', 'o');
    result := replace(result, 'п', 'p');
    result := replace(result, 'р', 'r');
    result := replace(result, 'с', 's');
    result := replace(result, 'т', 't');
    result := replace(result, 'у', 'u');
    result := replace(result, 'ф', 'f');
    result := replace(result, 'х', 'h');
    result := replace(result, 'ц', 'ts');
    result := replace(result, 'ч', 'ch');
    result := replace(result, 'ш', 'sh');
    result := replace(result, 'щ', 'sch');
    result := replace(result, 'ъ', '');
    result := replace(result, 'ы', 'y');
    result := replace(result, 'ь', '');
    result := replace(result, 'э', 'e');
    result := replace(result, 'ю', 'yu');
    result := replace(result, 'я', 'ya');
    
    -- Заглавные буквы
    result := replace(result, 'А', 'A');
    result := replace(result, 'Б', 'B');
    result := replace(result, 'В', 'V');
    result := replace(result, 'Г', 'G');
    result := replace(result, 'Д', 'D');
    result := replace(result, 'Е', 'E');
    result := replace(result, 'Ё', 'Yo');
    result := replace(result, 'Ж', 'Zh');
    result := replace(result, 'З', 'Z');
    result := replace(result, 'И', 'I');
    result := replace(result, 'Й', 'Y');
    result := replace(result, 'К', 'K');
    result := replace(result, 'Л', 'L');
    result := replace(result, 'М', 'M');
    result := replace(result, 'Н', 'N');
    result := replace(result, 'О', 'O');
    result := replace(result, 'П', 'P');
    result := replace(result, 'Р', 'R');
    result := replace(result, 'С', 'S');
    result := replace(result, 'Т', 'T');
    result := replace(result, 'У', 'U');
    result := replace(result, 'Ф', 'F');
    result := replace(result, 'Х', 'H');
    result := replace(result, 'Ц', 'Ts');
    result := replace(result, 'Ч', 'Ch');
    result := replace(result, 'Ш', 'Sh');
    result := replace(result, 'Щ', 'Sch');
    result := replace(result, 'Ъ', '');
    result := replace(result, 'Ы', 'Y');
    result := replace(result, 'Ь', '');
    result := replace(result, 'Э', 'E');
    result := replace(result, 'Ю', 'Yu');
    result := replace(result, 'Я', 'Ya');
    
    -- Приводим к нижнему регистру
    result := lower(result);
    
    -- Удаляем спецсимволы, оставляем только буквы, цифры и пробелы
    result := regexp_replace(result, '[^a-z0-9\s]', '', 'g');
    
    -- Заменяем пробелы на дефисы
    result := replace(result, ' ', '-');
    
    -- Удаляем множественные дефисы
    result := regexp_replace(result, '-+', '-', 'g');
    
    -- Удаляем дефисы в начале и конце
    result := trim(result, '-');
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Обновляем существующие новости с русскими slug
UPDATE news_articles 
SET id = transliterate_russian_to_english(title)
WHERE id ~ '[а-яё]' OR id ~ '[А-ЯЁ]';

-- Удаляем функцию после использования
DROP FUNCTION transliterate_russian_to_english(TEXT);
