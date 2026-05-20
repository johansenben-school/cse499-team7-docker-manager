CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT unique NOT NULL,
  password TEXT NOT NULL,
  isAdmin BOOLEAN DEFAULT false
);

INSERT INTO users (username, password, isAdmin) VALUES ('username1', 'password1', TRUE)