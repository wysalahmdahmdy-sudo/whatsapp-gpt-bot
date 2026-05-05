const { Client, LocalAuth } = require('whatsapp-web.js');

console.log('>>> بوټ شروع شو...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

client.on('qr', (qr) => {
    console.log('>>> QR کوډ جوړ شو. که 8 رقمي کوډ کار ونکړي دا Scan کړه');
});

client.on('ready', () => {
    console.log('✅✅ بوټ وصل شو +93706989006 ✅✅✅');
});

client.on('auth_failure', (msg) => {
    console.error('>>> AUTH FAILURE:', msg);
});

client.on('message', async (msg) => {
    console.log('>>> نوی مسیج:', msg.body);
    if (msg.body === 'سلام') await msg.reply('وعلیکم السلام وروره 💚 +93706989006');
    else if (msg.body === 'ټوکه') await msg.reply('29 ساعته وروسته جوړ شوم 😂');
    else await msg.reply('سلام ولیکه');
});

client.initialize();

console.log('>>> د 8 رقمي کوډ غوښتلو لپاره 5 ثانیې انتظار...');

setTimeout(async () => {
    try {
        console.log('>>> اوس کوډ غواړم...');
        const code = await client.requestPairingCode("93706989006");
        console.log('================================');
        console.log('>>> ستاسو 8 رقمي کوډ +93706989006:', code);
        console.log('================================');
    } catch (err) {
        console.log('>>> ERROR په کوډ کې:', err.message);
        console.log('>>> QR به ښکاره شي. هغه Scan کړه');
    }
}, 5000);
