const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('✓ Loaded dependencies');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

console.log('✓ Configured middleware');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

console.log('✓ Static files configured');

// API Routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('  ✓ Auth route');
app.use('/api/clients', require('./routes/clients'));
console.log('  ✓ Clients route');
app.use('/api/birthdays', require('./routes/birthdays'));
console.log('  ✓ Birthdays route');
app.use('/api/promotions', require('./routes/promotions'));
console.log('  ✓ Promotions route');

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

console.log('✓ Routes configured');

// Detect if running on Vercel (serverless environment)
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
    // Start Telegram bot (only in non-serverless environment)
    console.log('Starting Telegram bot...');
    try {
        require('./bot/index');
        console.log('✓ Telegram bot started');
    } catch (err) {
        console.error('✗ Bot error:', err.message);
    }

    // Start scheduler (only in non-serverless environment)
    console.log('Starting scheduler...');
    try {
        require('./scheduler/index');
        console.log('✓ Scheduler started');
    } catch (err) {
        console.error('✗ Scheduler error:', err.message);
    }

    // Start server (only in non-serverless environment)
    app.listen(PORT, () => {
        console.log('\n========================================');
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log('========================================\n');
        console.log('Admin Panel: http://localhost:' + PORT);
        console.log('Login: admin / ' + (process.env.ADMIN_PASSWORD || 'admin123'));
        console.log('\n========================================');
    });
} else {
    console.log('⚠️ Running on Vercel - Bot and Scheduler disabled');
    console.log('✓ Admin Panel API only');
}

module.exports = app;
