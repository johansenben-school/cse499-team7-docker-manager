const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database/app.db');
const sqlPath = path.join(__dirname, 'schema.sql');

const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
        return;
    }

    console.log('Connected to SQLite database.');

    // Seed only if DB did not exist yet
    if (!dbExists) {
        console.log('Initializing database from SQL file...');

        const initSql = fs.readFileSync(sqlPath, 'utf8');

        db.exec(initSql, (err) => {
            if (err) {
                console.error('Failed to initialize database:', err);
            } else {
                console.log('Database initialized successfully.');
            }
        });
    }
});

module.exports = db;