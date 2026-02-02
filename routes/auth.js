const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username va password talab qilinadi' });
        }

        // Find admin user
        const admin = await db.get(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );

        if (!admin) {
            return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
        }

        // Verify password
        const isValidPassword = bcrypt.compareSync(password, admin.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Login yoki parol noto\'g\'ri' });
        }

        // Set session
        req.session.adminId = admin.id;
        req.session.username = admin.username;

        res.json({
            success: true,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout xatosi' });
        }
        res.json({ success: true });
    });
});

// Verify session endpoint
router.get('/verify', (req, res) => {
    if (req.session.adminId) {
        res.json({
            authenticated: true,
            admin: {
                id: req.session.adminId,
                username: req.session.username
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
