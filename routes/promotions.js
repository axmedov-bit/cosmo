const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Middleware to check if admin is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.adminId) {
        return res.status(401).json({ error: 'Avval login qiling' });
    }
    next();
};

// Get all promotions
router.get('/', requireAuth, async (req, res) => {
    try {
        const promotions = await db.all(`
            SELECT * FROM promotions 
            ORDER BY created_at DESC
        `);

        // Parse pattern_data JSON
        promotions.forEach(promo => {
            if (promo.pattern_data) {
                try {
                    promo.pattern_data = JSON.parse(promo.pattern_data);
                } catch (e) {
                    promo.pattern_data = null;
                }
            }
        });

        res.json(promotions);
    } catch (error) {
        console.error('Get promotions error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Create new promotion
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, description, start_date, end_date, pattern_type, pattern_data } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Aksiya nomi talab qilinadi' });
        }

        const result = await db.run(
            `INSERT INTO promotions (name, description, start_date, end_date, pattern_type, pattern_data)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name,
                description || null,
                start_date || null,
                end_date || null,
                pattern_type || 'date_range',
                pattern_data || null  // Already stringified from frontend
            ]
        );

        // Send notification to all non-blocked clients
        const clients = await db.all(
            'SELECT telegram_user_id FROM clients WHERE is_blocked = 0 AND telegram_user_id IS NOT NULL'
        );

        // Import bot to send notifications
        const { sendPromotionNotification } = require('../bot/notifications');

        for (let client of clients) {
            try {
                await sendPromotionNotification(client.telegram_user_id, {
                    name,
                    description,
                    start_date,
                    end_date
                });

                // Log notification
                await db.run(
                    'INSERT INTO promotion_notifications (promotion_id, client_id) VALUES (?, ?)',
                    [result.id, client.id]
                );
            } catch (err) {
                console.error(`Failed to send notification to user ${client.telegram_user_id}:`, err);
            }
        }

        res.json({
            success: true,
            message: 'Aksiya yaratildi va xabarlar yuborildi',
            id: result.id
        });
    } catch (error) {
        console.error('Create promotion error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Update promotion
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { name, description, start_date, end_date, pattern_type, pattern_data, is_active } = req.body;

        await db.run(
            `UPDATE promotions 
             SET name = ?, description = ?, start_date = ?, end_date = ?, 
                 pattern_type = ?, pattern_data = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                name,
                description || null,
                start_date || null,
                end_date || null,
                pattern_type || 'date_range',
                pattern_data || null,  // Already stringified
                is_active !== undefined ? (is_active ? 1 : 0) : 1,
                req.params.id
            ]
        );

        res.json({ success: true, message: 'Aksiya yangilandi' });
    } catch (error) {
        console.error('Update promotion error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Delete promotion
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await db.run('DELETE FROM promotions WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Aksiya o\'chirildi' });
    } catch (error) {
        console.error('Delete promotion error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

module.exports = router;
