require('dotenv').config();

console.log('BOT TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'SET ✅' : 'NOT SET ❌');

try {
    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    console.log('Bot  created successfully ✅');
    process.exit(0);
} catch (err) {
    console.error('Bot error:', err);
    process.exit(1);
}
