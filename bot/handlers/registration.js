const db = require('../../config/database');

class RegistrationHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async handleStart(msg) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        // Check if user already registered
        const existingClient = await db.get(
            'SELECT * FROM clients WHERE telegram_user_id = ?',
            [userId]
        );

        if (existingClient) {
            return this.bot.sendMessage(
                chatId,
                '✅ Siz allaqachon ro\'yxatdan o\'tgansiz!\n\n' +
                'Agar ma\'lumotlaringizni o\'zgartirmoqchi bo\'lsangiz, admin bilan bog\'laning.'
            );
        }

        // Start registration
        await this.createSession(userId, 'first_name');

        return this.bot.sendMessage(
            chatId,
            '👋 Xush kelibsiz!\n\n' +
            'Ro\'yxatdan o\'tish uchun quyidagi ma\'lumotlarni kiriting.\n\n' +
            '📝 Ismingizni kiriting:'
        );
    }

    async handleMessage(msg) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const text = msg.text;

        // Get current session
        const session = await db.get(
            'SELECT * FROM registration_sessions WHERE telegram_user_id = ?',
            [userId]
        );

        if (!session) {
            return; // No active session
        }

        const data = session.data ? JSON.parse(session.data) : {};

        switch (session.step) {
            case 'first_name':
                data.first_name = text;
                await this.updateSession(userId, 'last_name', data);
                return this.bot.sendMessage(chatId, '📝 Familiyangizni kiriting:');

            case 'last_name':
                data.last_name = text;
                data.children = [];
                await this.updateSession(userId, 'child_name', data);
                return this.bot.sendMessage(chatId, '👶 Farzandingizning ismini kiriting:');

            case 'child_name':
                data.current_child = { first_name: text };
                await this.updateSession(userId, 'child_birth', data);
                return this.bot.sendMessage(
                    chatId,
                    '📅 Farzandingizning tug\'ilgan sanasini kiriting:\n' +
                    'Format: YYYY-MM-DD (masalan: 2015-05-20)'
                );

            case 'child_birth':
                const birthMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                if (!birthMatch) {
                    return this.bot.sendMessage(
                        chatId,
                        '❌ Noto\'g\'ri format! Iltimos, YYYY-MM-DD formatida kiriting (masalan: 2015-05-20)'
                    );
                }

                data.current_child.birth_year = parseInt(birthMatch[1]);
                data.current_child.birth_month = parseInt(birthMatch[2]);
                data.current_child.birth_day = parseInt(birthMatch[3]);

                data.children.push(data.current_child);
                delete data.current_child;

                await this.updateSession(userId, 'add_more', data);

                const keyboard = {
                    keyboard: [
                        [{ text: '➕ Yana qo\'shish' }],
                        [{ text: '✅ Yakunlash' }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                };

                return this.bot.sendMessage(
                    chatId,
                    `✅ ${data.children[data.children.length - 1].first_name} qo'shildi!\n\n` +
                    'Tanlang:',
                    { reply_markup: keyboard }
                );

            case 'add_more':
                if (text === '➕ Yana qo\'shish') {
                    await this.updateSession(userId, 'child_name', data);
                    return this.bot.sendMessage(chatId, '👶 Keyingi farzandingizning ismini kiriting:');
                } else if (text === '✅ Yakunlash') {
                    await this.updateSession(userId, 'phone', data);
                    const phoneKeyboard = {
                        keyboard: [
                            [{ text: '📱 Telefon raqamni yuborish', request_contact: true }]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    };
                    return this.bot.sendMessage(
                        chatId,
                        '📱 Telefon raqamingizni yuboring:\n' +
                        '(Pastdagi tugmani bosing yoki +998XXXXXXXXX formatida kiriting)',
                        { reply_markup: phoneKeyboard }
                    );
                } else {
                    return this.bot.sendMessage(chatId, 'Iltimos, tugmalardan birini tanlang.');
                }

            case 'phone':
                // Will be handled by handleContact
                return this.bot.sendMessage(
                    chatId,
                    'Iltimos, telefon raqamingizni yuboring (tugmani bosing yoki +998XXXXXXXXX formatida kiriting)'
                );
        }
    }

    async handleContact(msg) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const phoneNumber = msg.contact.phone_number;

        const session = await db.get(
            'SELECT * FROM registration_sessions WHERE telegram_user_id = ?',
            [userId]
        );

        if (!session || session.step !== 'phone') {
            return;
        }

        await this.completeRegistration(userId, chatId, phoneNumber, session, msg);
    }

    async completeRegistration(userId, chatId, phoneNumber, session, msg) {
        const data = JSON.parse(session.data);

        // Normalize phone number
        let normalizedPhone = phoneNumber.replace(/[^\d+]/g, '');
        if (!normalizedPhone.startsWith('+')) {
            normalizedPhone = '+' + normalizedPhone;
        }

        // Check for duplicate
        const existingClient = await db.get(
            'SELECT * FROM clients WHERE phone_number = ?',
            [normalizedPhone]
        );

        if (existingClient) {
            await this.deleteSession(userId);
            return this.bot.sendMessage(
                chatId,
                '❌ Siz avval ro\'yxatdan o\'tgansiz!\n\n' +
                'Bu telefon raqam allaqachon ro\'yxatga olingan.',
                { reply_markup: { remove_keyboard: true } }
            );
        }

        try {
            // Insert client
            const result = await db.run(
                `INSERT INTO clients (first_name, last_name, phone_number, telegram_user_id, telegram_username)
                 VALUES (?, ?, ?, ?, ?)`,
                [data.first_name, data.last_name, normalizedPhone, userId, msg.from.username || null]
            );

            const clientId = result.id;

            // Insert children
            for (let child of data.children) {
                await db.run(
                    `INSERT INTO children (client_id, first_name, birth_year, birth_month, birth_day)
                     VALUES (?, ?, ?, ?, ?)`,
                    [clientId, child.first_name, child.birth_year, child.birth_month, child.birth_day]
                );
            }

            // Delete session
            await this.deleteSession(userId);

            const childrenList = data.children.map(c =>
                `   • ${c.first_name} (${c.birth_day}.${c.birth_month}.${c.birth_year})`
            ).join('\n');

            return this.bot.sendMessage(
                chatId,
                '🎉 Tabriklaymiz! Ro\'yxatdan o\'tdingiz!\n\n' +
                `👤 ${data.first_name} ${data.last_name}\n` +
                `📱 ${normalizedPhone}\n\n` +
                `👶 Farzandlar:\n${childrenList}\n\n` +
                'Tug\'ilgan kunlar haqida sizga xabar berib turamiz! 🎂',
                { reply_markup: { remove_keyboard: true } }
            );
        } catch (error) {
            console.error('Registration error:', error);
            await this.deleteSession(userId);
            return this.bot.sendMessage(
                chatId,
                '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring: /start'
            );
        }
    }

    async createSession(userId, step) {
        await db.run(
            `INSERT OR REPLACE INTO registration_sessions (telegram_user_id, step, data, updated_at)
             VALUES (?, ?, '{}', CURRENT_TIMESTAMP)`,
            [userId, step]
        );
    }

    async updateSession(userId, step, data) {
        await db.run(
            `UPDATE registration_sessions 
             SET step = ?, data = ?, updated_at = CURRENT_TIMESTAMP
             WHERE telegram_user_id = ?`,
            [step, JSON.stringify(data), userId]
        );
    }

    async deleteSession(userId) {
        await db.run(
            'DELETE FROM registration_sessions WHERE telegram_user_id = ?',
            [userId]
        );
    }
}

module.exports = RegistrationHandler;
