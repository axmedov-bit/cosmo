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

// Get upcoming birthdays (3 days in advance)
router.get('/upcoming', requireAuth, async (req, res) => {
    try {
        const today = new Date();
        const upcoming = [];

        // Check next 3 days
        for (let i = 0; i <= 3; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() + i);

            const month = checkDate.getMonth() + 1;
            const day = checkDate.getDate();

            const children = await db.all(`
                SELECT 
                    ch.*,
                    c.first_name as parent_first_name,
                    c.last_name as parent_last_name,
                    c.phone_number,
                    c.telegram_user_id
                FROM children ch
                JOIN clients c ON ch.client_id = c.id
                WHERE ch.birth_month = ? AND ch.birth_day = ?
                ORDER BY c.last_name, c.first_name
            `, [month, day]);

            for (let child of children) {
                const age = today.getFullYear() - child.birth_year;
                const daysUntil = i;

                upcoming.push({
                    ...child,
                    age,
                    days_until_birthday: daysUntil,
                    birthday_date: `${child.birth_year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                });
            }
        }

        res.json(upcoming);
    } catch (error) {
        console.error('Get upcoming birthdays error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Send invitation messages to today's birthday parents
router.post('/send-invitations', requireAuth, async (req, res) => {
    try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Get today's birthdays
        const children = await db.all(`
            SELECT 
                ch.*,
                c.id as client_id,
                c.first_name as parent_first_name,
                c.last_name as parent_last_name,
                c.telegram_user_id,
                c.is_blocked
            FROM children ch
            JOIN clients c ON ch.client_id = c.id
            WHERE ch.birth_month = ? AND ch.birth_day = ?
            AND c.is_blocked = 0
            AND c.telegram_user_id IS NOT NULL
        `, [month, day]);

        if (children.length === 0) {
            return res.json({ success: true, sent_count: 0, message: 'Bugun tug\'ilgan kuni bo\'lgan farzandlar yo\'q' });
        }

        const { sendBirthdayInvitation } = require('../bot/notifications');
        let sentCount = 0;

        for (let child of children) {
            const success = await sendBirthdayInvitation(child.telegram_user_id, {
                first_name: child.first_name,
                parent_first_name: child.parent_first_name,
                parent_last_name: child.parent_last_name
            });

            if (success) {
                sentCount++;
            }
        }

        res.json({
            success: true,
            sent_count: sentCount,
            total: children.length,
            message: `${sentCount} ta xabar yuborildi`
        });
    } catch (error) {
        console.error('Send invitations error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

module.exports = router;
