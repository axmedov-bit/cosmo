console.log('Testing module loading...');

try {
    console.log('Loading database...');
    const db = require('./config/database');
    console.log('✅ Database loaded');
} catch (err) {
    console.error('❌ Database error:', err.message);
}

try {
    console.log('Loading routes/auth...');
    const auth = require('./routes/auth');
    console.log('✅ Auth loaded');
} catch (err) {
    console.error('❌ Auth error:', err.message);
}

try {
    console.log('Loading bot/index...');
    const bot = require('./bot/index');
    console.log('✅ Bot loaded');
} catch (err) {
    console.error('❌ Bot error:', err.message);
}

try {
    console.log('Loading scheduler/index...');
    const scheduler = require('./scheduler/index');
    console.log('✅ Scheduler loaded');
} catch (err) {
    console.error('❌ Scheduler error:', err.message);
}

console.log('\n✓ All tests complete');
