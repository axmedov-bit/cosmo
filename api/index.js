const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();

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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

console.log('✓ Configured middleware for Vercel');

// API Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/clients', require('../routes/clients'));
app.use('/api/birthdays', require('../routes/birthdays'));
app.use('/api/promotions', require('../routes/promotions'));

console.log('✓ API routes configured');

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'COSMO Admin API is running on Vercel',
        timestamp: new Date().toISOString(),
        note: 'Telegram bot and scheduler are not available on Vercel'
    });
});

// Export for Vercel serverless
module.exports = app;
