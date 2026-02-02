const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;

console.log('Testing bot token...');
console.log('Token exists:', !!token);
console.log('Token length:', token ? token.length : 0);

if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN is not set');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('✅ Bot initialized successfully');

bot.on('message', (msg) => {
    console.log('📩 Received message:', msg.text);
    console.log('From:', msg.from);
    bot.sendMessage(msg.chat.id, '✅ Bot is working! Message: ' + (msg.text || 'contact'));
});

bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.code, error.message);
});

console.log('🤖 Test bot is running. Send /start to your bot...');
