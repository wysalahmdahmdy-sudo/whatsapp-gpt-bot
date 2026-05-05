const { Client, LocalAuth } = require('whatsapp-web.js');

console.log('>>> بوټ +93706989006 شروع شو');

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: 'session' }),
    puppeteer: { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

client.on('qr', (qr) => {
    console.log('>>> QR جوړ شو. که کوډ کار ونکړي دا Scan کړه');
});

client.on('ready', () => {
    console.log('✅✅✅ بوټ وصل شو +93706989006 ✅✅✅');
});

client.on('authenticated', () => {
    console.log('>>> بوټ Authentication شو +93706989006');
});

client.on('message', async (msg) => {
    if (msg.fromMe) return;
    
    const text = msg.body;
    console.log('>>> مسیج:', text);
    
    if (text.includes('سلام')) {
        await msg.reply('💚 وعلیکم السلام وروره!\nزه د +93706989006 بوټ یم\n\n`ټوکه` یا `څنګه یې` ولیکه');
    }
    else if (text.includes('څنګه') || text.includes('خنګه') || text.includes('ژوندی')) {
        await msg.reply('ښه یم وروره شکر 💚\nته څنګه یې؟\nزه +93706989006 بوټ یم 🇦🇫');
    }
    else if (text.includes('ټوکه')) {
        await msg.reply('😂 ولې بوټ 29 ساعته وروسته ژوندی شو؟\nځکه افغان یې جوړ کړ 💪🇦🇫');
    }
    else if (text.includes('شمیره') || text.includes('نمبر')) {
        await msg.reply('زما نمبر: +93706989006 📱');
    }
    else {
        await msg.reply('وروره `سلام` `څنګه یې` یا `ټوکه` ولیکه 🤖\n+93706989006');
    }
});

client.initialize();

// دا برخه 8 رقمي کوډ لپاره ده 👇
setTimeout(async () => {
    try {
        console.log('>>> د کوډ غوښتلو لپاره 10 ثانیې انتظار...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log('>>> اوس 8 رقمي کوډ غواړم...');
        const code = await client.requestPairingCode("93706989006");
        
        console.log('========================================');
        console.log('>>> 8 رقمي کوډ +93706989006:', code);
        console.log('>>> دا کوډ WhatsApp > Linked Devices
