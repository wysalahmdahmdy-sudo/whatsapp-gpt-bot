const { Client, LocalAuth } = require('whatsapp-web.js');

console.log('>>> بوټ +93706989006 شروع شو');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

client.on('ready', () => {
    console.log('✅ بوټ وصل شو +93706989006');
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
    else if (text.includes('ټوکه') || text.includes('جوق')) {
        await msg.reply('😂 ولې بوټ 29 ساعته وروسته ژوندی شو؟\nځکه افغان یې جوړ کړ 💪🇦🇫\n+93706989006');
    }
    else if (text.includes('شمیره') || text.includes('نمبر')) {
        await msg.reply('زما نمبر: +93706989006 📱');
    }
    else if (text.includes('چا جوړ') || text.includes('څوک')) {
        await msg.reply('زه د +93706989006 خاوند جوړ کړم 🇦🇫💪');
    }
    else {
        await msg.reply('وروره `سلام` `څنګه یې` یا `ټوکه` ولیکه 🤖\n+93706989006');
    }
});

client.initialize();
