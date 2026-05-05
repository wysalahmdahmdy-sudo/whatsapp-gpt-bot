const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('ready', () => console.log('✅ بوټ چالان شو +93706989006'));

client.on('message_create', async msg => {
    if (msg.fromMe || msg.isGroupMsg) return;
    
    const text = msg.body;
    
    if (text.includes('سلام')) {
        msg.reply('وعلیکم السلام وروره 💚\n+93706989006');
    }
    else if (text.includes('ټوکه')) {
        msg.reply('ولې بوټ نه ستړی کیږي؟ ځکه په سرور دی 😂🤖');
    }
    else if (text.includes('پښتو')) {
        msg.reply('هو پښتو پوهېږم وروره 🇦🇫');
    }
    else if (text.includes('شمیره')) {
        msg.reply('زما نمبر: +93706989006 📱');
    }
    else {
        msg.reply('`سلام` یا `ټوکه` ولیکه 🤖');
    }
});

client.initialize();

setTimeout(async () => {
    const code = await client.requestPairingCode("93706989006");
    console.log('>>> کوډ:', code);
}, 3000);
