const TelegramBot = require('node-telegram-bot-api');
const RegistrationHandler = require('./handlers/registration');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not set in .env file');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const registrationHandler = new RegistrationHandler(bot);

console.log('Telegram bot started...');

// Handle /start command
bot.onText(/\/start/, async (msg) => {
    try {
        await registrationHandler.handleStart(msg);
    } catch (error) {
        console.error('Error handling /start:', error);
        bot.sendMessage(msg.chat.id, '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
});

// Handle contact sharing
bot.on('contact', async (msg) => {
    try {
        await registrationHandler.handleContact(msg);
    } catch (error) {
        console.error('Error handling contact:', error);
        bot.sendMessage(msg.chat.id, '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
});

// Handle regular messages
bot.on('message', async (msg) => {
    // Ignore commands and contacts
    if (msg.text && msg.text.startsWith('/')) return;
    if (msg.contact) return;

    try {
        await registrationHandler.handleMessage(msg);
    } catch (error) {
        console.error('Error handling message:', error);
        bot.sendMessage(msg.chat.id, '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring: /start');
    }
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

module.exports = bot;
