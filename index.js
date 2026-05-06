const { Client, LocalAuth } = require('whatsapp-web.js');
const Groq = require('groq-sdk');
const fs = require('fs');

// 1. زړه سیشن پاک کړه - مهم دی
const sessionPath = '/tmp/.wwebjs_auth';
if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    console.log('زړه سیشن پاک شو');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: sessionPath
  }),
  puppeteer: {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
    ]
  },
  pairingCode: true, // همدا 8-رقمي فعالوي
  qrMaxRetries: 0,
  authTimeoutMs: 60000
});

// 2. 8-رقمي کوډ Deploy Logs کې ښیي
client.on('pairing-code', (code) => {
    console.log(' ');
    console.log('================================');
    console.log('👇👇 ستا 8-رقمي کوډ 👇👇');
    console.log(' ' + code);
    console.log('================================');
    console.log(' ');
});

client.on('ready', () => {
    console.log('✅ بوټ چالان شو - ويصال احمد');
});

client.on('auth_failure', msg => {
    console.error('سیشن خراب شو:', msg);
});

client.on('message', async (message) => {
  if (message.body &&!message.fromMe) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are Wesal Bot. Always reply ONLY in Kandahari Pashto. Never use English. Keep answers short and friendly. You were created by Wesal Ahmad from Herat. Your number is +93706989006. If user asks "ته څوک یې" reply: ځار شم وروره! زه ويصال بوټ یم، ويصال احمد مې جوړ کړی یم 💚'
          },
          { role: 'user', content: message.body }
        ],
        model: 'llama-3.1-8b-instant'
      });
      message.reply(chatCompletion.choices[0]?.message?.content || 'پوه نشوم');
    } catch (error) {
      console.log('Error:', error);
    }
  }
});

client.initialize();
