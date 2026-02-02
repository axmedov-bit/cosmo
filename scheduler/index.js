const cron = require('node-cron');
const db = require('../config/database');
const { sendBirthdayReminder, sendBirthdayCongratulation, sendBirthdayInvitation } = require('../bot/notifications');

// Run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
    console.log('Running birthday check scheduler...');

    try {
        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayDay = today.getDate();

        // Check birthdays for today (congratulations)
        await checkBirthdaysForDay(today, todayMonth, todayDay, 0, 'congratulation');

        // Check birthdays for next 3 days (reminders)
        for (let i = 1; i <= 3; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(futureDate.getDate() + i);

            const month = futureDate.getMonth() + 1;
            const day = futureDate.getDate();

            await checkBirthdaysForDay(futureDate, month, day, i, 'reminder');
        }
    } catch (error) {
        console.error('Scheduler error:', error);
    }
});

async function checkBirthdaysForDay(date, month, day, daysUntil, notificationType) {
    const year = date.getFullYear();

    // Get children with birthdays on this day
    const children = await db.all(`
        SELECT 
            ch.id as child_id,
            ch.first_name,
            ch.birth_year,
            ch.birth_month,
            ch.birth_day,
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

    for (let child of children) {
        // Check if notification already sent today
        const alreadySent = await db.get(`
            SELECT * FROM birthday_notifications
            WHERE child_id = ? 
            AND notification_type = ?
            AND DATE(sent_at) = DATE('now')
        `, [child.child_id, notificationType]);

        if (alreadySent) {
            console.log(`Notification already sent for child ${child.child_id}`);
            continue;
        }

        const age = year - child.birth_year;

        const childData = {
            ...child,
            age,
            days_until: daysUntil
        };

        let success = false;

        if (notificationType === 'congratulation') {
            // Send congratulation message
            success = await sendBirthdayCongratulation(child.telegram_user_id, childData);

            // Also send invitation message on the actual birthday
            if (success) {
                await sendBirthdayInvitation(child.telegram_user_id, childData);
                console.log(`Sent invitation for child ${child.first_name}`);
            }
        } else {
            success = await sendBirthdayReminder(child.telegram_user_id, childData);
        }

        if (success) {
            // Log notification
            await db.run(
                'INSERT INTO birthday_notifications (child_id, notification_type) VALUES (?, ?)',
                [child.child_id, notificationType]
            );
            console.log(`Sent ${notificationType} for child ${child.first_name} to user ${child.telegram_user_id}`);
        }
    }
}

console.log('Birthday scheduler initialized (runs daily at 9:00 AM)');

module.exports = {};
