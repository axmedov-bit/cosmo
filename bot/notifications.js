const TelegramBot = require('node-telegram-bot-api');
const db = require('../config/database');
require('dotenv').config();

async function sendBirthdayReminder(telegramUserId, childData) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

    const message = `🎂 Eslatma!\n\n` +
        `${childData.first_name}ning tug'ilgan kuniga ${childData.days_until} kun qoldi!\n` +
        `Tug'ilgan kun: ${childData.birth_day}-${getMonthName(childData.birth_month)}\n` +
        `${childData.age} yoshga to'ladi 🎉`;

    try {
        await bot.sendMessage(telegramUserId, message);
        return true;
    } catch (error) {
        console.error(`Failed to send birthday reminder to ${telegramUserId}:`, error);
        return false;
    }
}

async function sendBirthdayCongratulation(telegramUserId, childData) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

    const message = `🎉🎂 TUG'ILGAN KUNINGIZ MUBORAK! 🎂🎉\n\n` +
        `Hurmatli ${childData.parent_first_name} ${childData.parent_last_name}!\n\n` +
        `Sizning farzandingiz ${childData.first_name}ning tug'ilgan kuni!\n` +
        `Bugun u ${childData.age} yoshga to'ldi! 🎈\n\n` +
        `Unga sog'lik, baxt va omad tilaymiz! 🌟`;

    try {
        await bot.sendMessage(telegramUserId, message);
        return true;
    } catch (error) {
        console.error(`Failed to send birthday congratulation to ${telegramUserId}:`, error);
        return false;
    }
}

async function sendPromotionNotification(telegramUserId, promotionData) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

    let message = `🎁 YANGI AKSIYA! 🎁\n\n` +
        `📌 ${promotionData.name}\n\n`;

    if (promotionData.description) {
        message += `📝 ${promotionData.description}\n\n`;
    }

    if (promotionData.start_date && promotionData.end_date) {
        message += `📅 Amal qilish muddati:\n` +
            `${formatDate(promotionData.start_date)} - ${formatDate(promotionData.end_date)}`;
    }

    try {
        await bot.sendMessage(telegramUserId, message);
        return true;
    } catch (error) {
        console.error(`Failed to send promotion notification to ${telegramUserId}:`, error);
        return false;
    }
}

async function sendBirthdayInvitation(telegramUserId, childData) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

    const message = `🎉 Assalomu alaykum!\n\n` +
        `Bugun sizning farzandingiz ${childData.first_name}ning tug'ilgan kuni! 🎂\n\n` +
        `Sizni kutib qolamiz! 🎈🎁\n\n` +
        `Hurmat bilan, bizning jamoa 💐`;

    try {
        await bot.sendMessage(telegramUserId, message);
        return true;
    } catch (error) {
        console.error(`Failed to send birthday invitation to ${telegramUserId}:`, error);
        return false;
    }
}

function getMonthName(month) {
    const months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    return months[month - 1];
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getDate()}-${getMonthName(date.getMonth() + 1)}-${date.getFullYear()}`;
}

module.exports = {
    sendBirthdayReminder,
    sendBirthdayCongratulation,
    sendPromotionNotification,
    sendBirthdayInvitation
};
