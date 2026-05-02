const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('QR کوډ سکین کړه:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('بوټ چالان شو! ✅');
});

client.on('message', async (message) => {
    if (message.body) {
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [{ role: "user", content: message.body }],
                model: "llama-3.1-8b-instant",
            });
            const reply = chatCompletion.choices[0]?.message?.content || "بخښنه، ځواب نشم ورکولی";
            message.reply(reply);
        } catch (error) {
            console.error('Groq Error:', error);
            message.reply('بخښنه، یوه ستونزه راغله 😔');
        }
    }
});

client.initialize();
