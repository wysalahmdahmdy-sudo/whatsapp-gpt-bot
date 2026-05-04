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
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

client.on('qr', (qr) => {
    console.log('================ QR CODE ================');
    qrcode.generate(qr, { small: true });
    console.log('========================================');
    console.log('دا QR په موبایل کې سکن کړه');
});

client.on('authenticated', () => {
    console.log('✅✅✅ Authentication بریالی شو!');
});

client.on('ready', () => {
    console.log('✅ بوټ چالان شو او WhatsApp سره Connect شو');
});

client.on('message', async (message) => {
  if (message.body) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: message.body }],
        model: 'llama-3.1-8b-instant'
      });
      message.reply(chatCompletion.choices[0]?.message?.content || '...');
    } catch (error) {
      console.log('Groq Error:', error);
    }
  }
});

client.initialize();
