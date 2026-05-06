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
  },
  pairingCode: true,
});

client.on('code', (code) => {
    console.log('*** Pairing Code:', code, '***');
    console.log('*** دا کوډ په WhatsApp ولیکه ***');
});

client.on('ready', () => {
    console.log('بوټ چالان شو ✅');
});

client.on('message', async (message) => {
  if (message.body) {
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
      const reply = chatCompletion.choices[0]?.message?.content || 'ځواب نشم ورکولی';
      message.reply(reply);
    } catch (error) {
      console.log('Error:', error);
      message.reply('بخښنه، ستونزه پېښه شوه');
    }
  }
});

client.initialize().then(() => {
  client.requestPairingCode('93706989006');
});
