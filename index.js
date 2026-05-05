const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const PHONE_NUMBER = "93706989006";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process'
        ]
    },
    // دا مهم دی - مسیج راوستلو لپاره
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('code', (code) => {
    console.log('================================');
    console.log('ستاسو 8 رقمي کوډ:', code);
    console.log('================================');
});

client.on('ready', () => {
    console.log('✅ بوټ چالان شو وروره!');
});

client.on('authenticated', () => {
    console.log('✅ AUTHENTICATED');
});

// مهم: message_create وکاروه نه message
client.on('message_create', async (message) => {
    if (message.fromMe) return;
    if (message.isGroupMsg) return;
    
    console.log('>>> نوی مسیج:', message.body);
    
    try {
        await message.reply('🤖 زه بوټ یم وروره! تاسو ولیکل: ' + message.body);
        console.log('>>> ځواب واستول شو');
    } catch (err) {
        console.log('>>> Error:', err.message);
    }
});

client.initialize();

setTimeout(async () => {
    try {
        const pairingCode = await client.requestPairingCode(PHONE_NUMBER);
        console.log('================================');
        console.log('ستاسو 8 رقمي کوډ:', pairingCode);
        console.log('================================');
    } catch (err) {
        console.log('Error:', err.message);
    }
}, 5000);
