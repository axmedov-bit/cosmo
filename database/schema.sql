-- Admins table for admin panel authentication
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clients table (ota-ona ma'lumotlari)
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    telegram_user_id INTEGER UNIQUE,
    telegram_username TEXT,
    is_blocked INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Children table (farzandlar ma'lumotlari)
CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    birth_year INTEGER NOT NULL,
    birth_month INTEGER NOT NULL,
    birth_day INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Promotions table (aksiyalar)
CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    pattern_type TEXT, -- 'date_range', 'weekly', 'monthly'
    pattern_data TEXT, -- JSON ma'lumot (masalan, haftaning kunlari yoki oyning kunlari)
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Registration sessions (bot orqali ro'yxatdan o'tish jarayoni)
CREATE TABLE IF NOT EXISTS registration_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_user_id INTEGER UNIQUE NOT NULL,
    step TEXT NOT NULL, -- 'first_name', 'last_name', 'child_name', 'child_birth', 'phone'
    data TEXT, -- JSON formatda vaqtinchalik ma'lumotlar
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Birthday notifications log (yuborilgan xabarlarni log qilish)
CREATE TABLE IF NOT EXISTS birthday_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL,
    notification_type TEXT NOT NULL, -- 'reminder' yoki 'congratulation'
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Promotion notifications log
CREATE TABLE IF NOT EXISTS promotion_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    promotion_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone_number);
CREATE INDEX IF NOT EXISTS idx_clients_telegram ON clients(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_children_client ON children(client_id);
CREATE INDEX IF NOT EXISTS idx_children_birth ON children(birth_month, birth_day);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);
