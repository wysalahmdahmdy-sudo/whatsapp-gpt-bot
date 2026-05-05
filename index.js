const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const PHONE_NUMBER = "93706989006"; // ستا نمبر +93 بغیر

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
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
    console.log('Client is ready!');
    console.log('WhatsApp وصل شو وروره!');
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.initialize();

// 5 ثانیې وروسته 8 رقمي کوډ وغواړه
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
