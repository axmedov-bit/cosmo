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

// Create new client (admin)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { first_name, last_name, phone_number, children } = req.body;

        if (!first_name || !last_name || !phone_number) {
            return res.status(400).json({ error: 'Ism, familiya va telefon raqam talab qilinadi' });
        }

        // Normalize phone number
        let normalizedPhone = phone_number.replace(/[^\d+]/g, '');
        if (!normalizedPhone.startsWith('+')) {
            normalizedPhone = '+' + normalizedPhone;
        }

        // Check for duplicate
        const existingClient = await db.get(
            'SELECT * FROM clients WHERE phone_number = ?',
            [normalizedPhone]
        );

        if (existingClient) {
            return res.status(400).json({ error: 'Bu telefon raqam allaqachon ro\'yxatda' });
        }

        // Insert client
        const result = await db.run(
            `INSERT INTO clients (first_name, last_name, phone_number)
             VALUES (?, ?, ?)`,
            [first_name, last_name, normalizedPhone]
        );

        const clientId = result.id;

        // Insert children if provided
        if (children && Array.isArray(children)) {
            for (let child of children) {
                if (child.first_name && child.birth_year && child.birth_month && child.birth_day) {
                    await db.run(
                        `INSERT INTO children (client_id, first_name, birth_year, birth_month, birth_day)
                         VALUES (?, ?, ?, ?, ?)`,
                        [clientId, child.first_name, child.birth_year, child.birth_month, child.birth_day]
                    );
                }
            }
        }

        res.json({
            success: true,
            message: 'Klient muvaffaqiyatli qo\'shildi',
            id: clientId
        });
    } catch (error) {
        console.error('Create client error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Get all clients with their children
router.get('/', requireAuth, async (req, res) => {
    try {
        const clients = await db.all(`
            SELECT 
                c.id,
                c.first_name,
                c.last_name,
                c.phone_number,
                c.telegram_user_id,
                c.telegram_username,
                c.is_blocked,
                c.created_at
            FROM clients c
            ORDER BY c.created_at DESC
        `);

        // Get children for each client
        for (let client of clients) {
            const children = await db.all(
                'SELECT * FROM children WHERE client_id = ? ORDER BY birth_year, birth_month, birth_day',
                [client.id]
            );
            client.children = children;
        }

        res.json(clients);
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Get single client by id
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const client = await db.get(
            'SELECT * FROM clients WHERE id = ?',
            [req.params.id]
        );

        if (!client) {
            return res.status(404).json({ error: 'Klient topilmadi' });
        }

        const children = await db.all(
            'SELECT * FROM children WHERE client_id = ?',
            [client.id]
        );

        client.children = children;
        res.json(client);
    } catch (error) {
        console.error('Get client error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Update client
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { first_name, last_name, phone_number, children } = req.body;

        // Update client info
        await db.run(
            `UPDATE clients 
             SET first_name = ?, last_name = ?, phone_number = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [first_name, last_name, phone_number, req.params.id]
        );

        // Update children if provided
        if (children && Array.isArray(children)) {
            // Delete existing children
            await db.run('DELETE FROM children WHERE client_id = ?', [req.params.id]);

            // Insert updated children
            for (let child of children) {
                await db.run(
                    `INSERT INTO children (client_id, first_name, birth_year, birth_month, birth_day)
                     VALUES (?, ?, ?, ?, ?)`,
                    [req.params.id, child.first_name, child.birth_year, child.birth_month, child.birth_day]
                );
            }
        }

        res.json({ success: true, message: 'Klient ma\'lumotlari yangilandi' });
    } catch (error) {
        console.error('Update client error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Delete client
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await db.run('DELETE FROM clients WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Klient o\'chirildi' });
    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Block/unblock client
router.post('/:id/block', requireAuth, async (req, res) => {
    try {
        const { is_blocked } = req.body;

        await db.run(
            'UPDATE clients SET is_blocked = ? WHERE id = ?',
            [is_blocked ? 1 : 0, req.params.id]
        );

        res.json({
            success: true,
            message: is_blocked ? 'Klient bloklandi' : 'Klient blokdan chiqarildi'
        });
    } catch (error) {
        console.error('Block client error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

module.exports = router;
