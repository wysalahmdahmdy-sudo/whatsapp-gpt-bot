const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const PHONE_NUMBER = "93706989006"; // ط³طھط§ ظ†ظ…ط¨ط± +93 ط¨ط؛غŒط±

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
    console.log('ط³طھط§ط³ظˆ 8 ط±ظ‚ظ…ظٹ ع©ظˆع‰:', code);
    console.log('================================');
});

client.on('ready', () => {
    console.log('Client is ready!');
    console.log('WhatsApp ظˆطµظ„ ط´ظˆ ظˆط±ظˆط±ظ‡!');
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.initialize();

// 5 ط«ط§ظ†غŒغگ ظˆط±ظˆط³طھظ‡ 8 ط±ظ‚ظ…ظٹ ع©ظˆع‰ ظˆط؛ظˆط§ع“ظ‡
setTimeout(async () => {
    try {
        const pairingCode = await client.requestPairingCode(PHONE_NUMBER);
        console.log('================================');
        console.log('ط³طھط§ط³ظˆ 8 ط±ظ‚ظ…ظٹ ع©ظˆع‰:', pairingCode);
        console.log('================================');
    } catch (err) {
        console.log('Error:', err.message);
    }
}, 5000);
