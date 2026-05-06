const { Client, LocalAuth } = require('whatsapp-web.js');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "/tmp/.wwebjs_auth"
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  },
  pairingCode: true, // همدا 8-رقمي کوډ فعالوي
  qrMaxRetries: 0
});

// 8-رقمي کوډ Deploy Logs کې ښیي
client.on('pairing-code', (code) => {
    console.log('==============================');
    console.log('👇 ستا 8-رقمي کوډ همدا دی:');
    console.log(code);
    console.log('==============================');
    console.log('واټساف > Linked Devices > Link with phone number کې یې ولیکه');
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
