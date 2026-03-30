CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    emoji TEXT DEFAULT '🎮',
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);