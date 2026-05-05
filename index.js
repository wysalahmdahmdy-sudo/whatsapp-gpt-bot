const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// ستا شمیره دلته ده وروره 👇
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
    console.log('ستاسو 8 رقمي کوډ د +93706989006 لپاره:', code);
    console.log('================================');
});

client.on('ready', () => {
    console.log('✅ بوټ چالان شو! شمیره: +93706989006');
});

client.on('authenticated', () => {
    console.log('✅ AUTHENTICATED +93706989006');
});

client.on('auth_failure', msg => {
    console.error('❌ AUTHENTICATION FAILURE', msg);
});

client.on('message_create', async (message) => {
    if (message.fromMe) return;
    if (message.isGroupMsg) return;
    
    const msg = message.body.toLowerCase().trim();
    const sender = message.from;
    console.log('>>> نوی مسیج له:', sender, 'متن:', message.body);
    
    try {
        if (msg.includes('سلام')) {
            await message.reply('وعلیکم السلام وروره! 🤖💚\nزه ستا WhatsApp بوټ یم\nشمیره: +93706989006\n\n`!help` ولیکه');
        }
        else if (msg.includes('چا جوړ') || msg.includes('څوک یې جوړ')) {
            await message.reply('زه د +93706989006 نمبر خاوند 29 ساعته کې جوړ کړم! 🇦🇫💪');
        }
        else if (msg.includes('شمیره') || msg.includes('نمبر')) {
            await message.reply('زما د مالک شمیره ده: +93706989006 📱');
        }
        else if (msg.includes('څه کولای شې') || msg.includes('کولای شي')) {
            await message.reply(`🤖 زه د +93706989006 بوټ یم\n\nزما کارونه:\n1. سلام ته ځواب 🤝\n2. وخت: !time ⏰\n3. ټوکه: !joke 😂\n4. کمانډونه: !help\n\nهر څه راولیږه ځواب درکوم 💚`);
        }
        else if (msg === '!time') {
            const time = new Date().toLocaleTimeString('fa-AF', {timeZone: 'Asia/Kabul'});
            await message.reply('⏰ د افغانستان وخت: ' + time + '\nبوټ: +93706989006');
        }
        else if (msg === '!joke') {
            const jokes = [
                'ولې +93706989006 بوټ تل خوشحاله دی؟ ځکه Crash نه کیږي! 😂🚀',
                'بوټ ته یې وویل ستړی مه شې، ويې ویل: زه خو په Railway یم نه ستړی کیږم 🤖',
                '29 ساعته کوډ وهل اسانه دي خو بوټ چلول سخت دي 😂💪'
            ];
            await message.reply(jokes[Math.floor(Math.random() * jokes.length)]);
        }
        else if (msg === '!help') {
            await message.reply(`🤖 د +93706989006 بوټ کمانډونه:\n\n!time - وخت\n!joke - ټوکه\n!ping - بوټ ژوندی دی\nسلام - روغبړ\nشمیره - زما نمبر\nته څه کولای شې - کارونه 💚`);
        }
        else if (msg === '!ping') {
            await message.reply('Pong! 🏓\nبوټ 100% ژوندی دی\nشمیره: +93706989006 🚀');
        }
        else {
            await message.reply('وروره پوه نشوم 🤔\n\n`!help` ولیکه چې کمانډونه درته وښیم\nزه د +93706989006 بوټ یم');
        }
    } catch (err) {
        console.log('>>> Error:', err.message);
    }
});

client.initialize();

setTimeout(async () => {
    try {
        const pairingCode = await client.requestPairingCode(PHONE_NUMBER);
        console.log('================================');
        console.log('ستاسو 8 رقمي کوډ د +93706989006 لپاره:', pairingCode);
        console.log('================================');
    } catch (err) {
        console.log('Error په کوډ غوښتلو کې:', err.message);
    }
}, 5000);
