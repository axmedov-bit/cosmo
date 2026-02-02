const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './database/clients.db';

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});

// Read and execute schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

db.serialize(() => {
    // Execute schema
    db.exec(schema, (err) => {
        if (err) {
            console.error('Schema creation error:', err.message);
            process.exit(1);
        }
        console.log('Database schema created successfully');
    });

    // Create default admin user
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    db.run(
        'INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)',
        [adminUsername, passwordHash],
        (err) => {
            if (err) {
                console.error('Admin creation error:', err.message);
            } else {
                console.log(`Default admin user created: ${adminUsername}`);
                console.log(`Default password: ${adminPassword}`);
                console.log('Please change the password after first login!');
            }
        }
    );
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('\nDatabase initialization complete!');
        console.log('Run "npm start" to start the server');
    }
});
