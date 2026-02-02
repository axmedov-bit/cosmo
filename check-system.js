const path = require('path');
const fs = require('fs');

console.log('🔍 COMPREHENSIVE SYSTEM CHECK\n');

// 1. Check all required files exist
const requiredFiles = [
    '.env',
    'package.json',
    'server.js',
    'config/database.js',
    'database/init.js',
    'database/schema.sql',
    'bot/index.js',
    'bot/handlers/registration.js',
    'bot/notifications.js',
    'scheduler/index.js',
    'routes/auth.js',
    'routes/clients.js',
    'routes/birthdays.js',
    'routes/promotions.js',
    'public/dashboard.html',
    'public/login.html',
    'public/css/styles.css',
    'public/css/promo-cards.css',
    'public/js/auth.js',
    'public/js/clients.js',
    'public/js/birthdays.js',
    'public/js/promotions.js',
];

console.log('📁 Checking file existence...');
let missingFiles = [];
requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        missingFiles.push(file);
        console.log(`   ❌ Missing: ${file}`);
    }
});

if (missingFiles.length === 0) {
    console.log('   ✅ All required files exist\n');
} else {
    console.log(`\n   ⚠️  ${missingFiles.length} files missing!\n`);
}

// 2. Check environment variables
console.log('🔐 Checking environment variables...');
require('dotenv').config();
const requiredEnv = [
    'TELEGRAM_BOT_TOKEN',
    'PORT',
    'SESSION_SECRET',
    'DATABASE_PATH',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'TZ'
];

let missingEnv = [];
requiredEnv.forEach(env => {
    if (!process.env[env]) {
        missingEnv.push(env);
        console.log(`   ❌ Missing: ${env}`);
    } else {
        console.log(`   ✅ ${env}: ${env.includes('PASSWORD') || env.includes('TOKEN') || env.includes('SECRET') ? '***' : process.env[env]}`);
    }
});

if (missingEnv.length > 0) {
    console.log(`\n   ⚠️  ${missingEnv.length} environment variables missing!\n`);
} else {
    console.log('');
}

// 3. Check database
console.log('💾 Checking database...');
const db = require('./config/database');

Promise.all([
    db.all("SELECT name FROM sqlite_master WHERE type='table'"),
    db.get("SELECT COUNT(*) as count FROM clients"),
    db.get("SELECT COUNT(*) as count FROM children"),
    db.get("SELECT COUNT(*) as count FROM promotions"),
    db.all("PRAGMA table_info(promotions)")
]).then(results => {
    const tables = results[0].map(t => t.name);
    console.log(`   ✅ Tables: ${tables.join(', ')}`);
    console.log(`   ✅ Clients: ${results[1].count}`);
    console.log(`   ✅ Children: ${results[2].count}`);
    console.log(`   ✅ Promotions: ${results[3].count}`);

    const promotionColumns = results[4].map(c => c.name);
    console.log(`   ✅ Promotions columns: ${promotionColumns.join(', ')}`);

    if (promotionColumns.includes('pattern_type') && promotionColumns.includes('pattern_data')) {
        console.log('   ✅ Weekly promotion columns exist\n');
    } else {
        console.log('   ⚠️  Missing pattern_type or pattern_data columns!\n');
    }

    // 4. Summary
    console.log('📊 SUMMARY:');
    console.log(`   Files: ${requiredFiles.length - missingFiles.length}/${requiredFiles.length}`);
    console.log(`   Environment: ${requiredEnv.length - missingEnv.length}/${requiredEnv.length}`);
    console.log(`   Database: OK`);

    if (missingFiles.length === 0 && missingEnv.length === 0) {
        console.log('\n✅ ALL CHECKS PASSED!');
    } else {
        console.log('\n⚠️  SOME ISSUES FOUND - Check above for details');
    }

    process.exit(0);
}).catch(err => {
    console.error('\n❌ Database error:', err.message);
    process.exit(1);
});
