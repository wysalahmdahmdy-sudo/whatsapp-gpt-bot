const { Client, LocalAuth } = require('whatsapp-web.js');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
  },
  qrMaxRetries: 0
});

client.on('qr', () => {
    console.log('QR بند دی');
});

client.on('ready', () => {
    console.log('✅ بوټ چالان شو');
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

// 15 ثانیې انتظار - دا مهمه ده
setTimeout(async () => {
    try {
        console.log('⏳ د Pairing Code غوښتنه پیل شوه...');
        const phoneNumber = '93706989006'; // خپل نمبر دلته چک کړه
        console.log('نمبر:', phoneNumber);
        const code = await client.requestPairingCode(phoneNumber);
        console.log('');
        console.log('========================================');
        console.log('*** Pairing Code:', code, '***');
        console.log('========================================');
        console.log('');
    } catch (err) {
        console.log('❌ اصلي ستونزه:', err.message);
        console.log('❌ ټول Error:', err);
    }
}, 15000); // 15 ثانیې
