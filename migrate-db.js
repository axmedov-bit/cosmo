const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './database/clients.db';
const db = new sqlite3.Database(dbPath);

console.log('Adding new columns to promotions table...');

// Add pattern_type and pattern_data columns if they don't exist
db.serialize(() => {
    db.run(`
        ALTER TABLE promotions ADD COLUMN pattern_type TEXT DEFAULT 'date_range'
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding pattern_type:', err.message);
        } else {
            console.log('✅ pattern_type column added or already exists');
        }
    });

    db.run(`
        ALTER TABLE promotions ADD COLUMN pattern_data TEXT DEFAULT NULL
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding pattern_data:', err.message);
        } else {
            console.log('✅ pattern_data column added or already exists');
        }

        db.close(() => {
            console.log('\n✓ Database migration complete!');
        });
    });
});
