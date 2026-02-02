const db = require('./config/database');
const { sendBirthdayReminder, sendBirthdayCongratulation, sendBirthdayInvitation } = require('./bot/notifications');
require('dotenv').config();

async function testBirthdayNotifications() {
    console.log('🧪 Testing birthday notifications...\n');

    try {
        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayDay = today.getDate();

        console.log(`📅 Today: ${todayDay}-${todayMonth}-${today.getFullYear()}`);
        console.log('');

        // Check birthdays for today (congratulations)
        console.log('✅ Checking birthdays for TODAY (congratulations)...');
        await checkBirthdaysForDay(today, todayMonth, todayDay, 0, 'congratulation');

        // Check birthdays for next 3 days (reminders)
        for (let i = 1; i <= 3; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(futureDate.getDate() + i);

            const month = futureDate.getMonth() + 1;
            const day = futureDate.getDate();

            console.log(`\n🔔 Checking birthdays ${i} days from now (${day}-${month})...`);
            await checkBirthdaysForDay(futureDate, month, day, i, 'reminder');
        }

        console.log('\n✅ Test completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

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

    console.log(`   Found ${children.length} children with birthday on ${day}-${month}`);

    for (let child of children) {
        const age = year - child.birth_year;

        const childData = {
            ...child,
            age,
            days_until: daysUntil
        };

        console.log(`   → Sending ${notificationType} for ${child.first_name} to user ${child.telegram_user_id}...`);

        let success = false;

        if (notificationType === 'congratulation') {
            // Send congratulation
            success = await sendBirthdayCongratulation(child.telegram_user_id, childData);

            // Also send invitation on birthday
            if (success) {
                console.log(`   → Sending invitation message...`);
                await sendBirthdayInvitation(child.telegram_user_id, childData);
            }
        } else {
            success = await sendBirthdayReminder(child.telegram_user_id, childData);
        }

        if (success) {
            console.log(`   ✅ Sent successfully!`);
        } else {
            console.log(`   ❌ Failed to send!`);
        }
    }
}

testBirthdayNotifications();
