const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const PHONE_NUMBER = "93706989006";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote', '--single-process']
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.on('qr', (qr) => { qrcode.generate(qr, {small: true}); });

client.on('code', (code) => {
    console.log('================================');
    console.log('ستاسو 8 رقمي کوډ:', code);
    console.log('================================');
});

client.on('ready', () => { console.log('✅ بوټ چالان شو وروره!'); });

client.on('authenticated', () => { console.log('✅ AUTHENTICATED'); });

client.on('message_create', async (message) => {
    if (message.fromMe) return;
    if (message.isGroupMsg) return;
    
    const msg = message.body.toLowerCase().trim();
    console.log('>>> نوی مسیج:', message.body);
    
    try {
        if (msg.includes('سلام')) {
            await message.reply('وعلیکم السلام وروره! 🤖💚\nزه ستا WhatsApp بوټ یم. `!help` ولیکه');
        }
        else if (msg.includes('چا جوړ') || msg.includes('څوک یې جوړ')) {
            await message.reply('زه یو اتل افغان ورور 29 ساعته کې جوړ کړم! 🇦🇫💪');
        }
        else if (msg.includes('څه کول
