const { Client, LocalAuth } = require('whatsapp-web.js');
const Groq = require('groq-sdk');
const fs = require('fs');

// زړه سیشن پاک کړه
if (fs.existsSync('/tmp/.wwebjs_auth')) {
    fs.rmSync('/tmp/.wwebjs_auth', { recursive: true, force: true });
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "/tmp/.wwebjs_auth"
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  pairingCode: true,
  qrMaxRetries: 0
});

// همدا 8-رقمي کوډ ښیي
client.on('pairing-code', (code) => {
    console.log('==============================');
    console.log('👇 8-رقمي کوډ:', code);
    console.log('==============================');
});

client.on('ready', () => {
    console.log('✅ بوټ چالان شو - ويصال احمد');
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
      const reply = chatCompletion.choices[0]?.message?.content || 'پوه نشوم وروره';
      message.reply(reply);
    } catch (error) {
      console.log('Error:', error);
    }
  }
});

client.initialize();
