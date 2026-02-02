const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './database/clients.db';
const db = new sqlite3.Database(dbPath);

const newPassword = process.env.ADMIN_PASSWORD || 'admin123';
const passwordHash = bcrypt.hashSync(newPassword, 10);

db.run(
    'UPDATE admins SET password_hash = ? WHERE username = ?',
    [passwordHash, 'admin'],
    function (err) {
        if (err) {
            console.error('❌ Error:', err.message);
        } else if (this.changes > 0) {
            console.log('✅ Admin password updated successfully!');
            console.log(`New password: ${newPassword}`);
        } else {
            console.log('⚠️  No admin user found');
        }
        db.close();
    }
);
