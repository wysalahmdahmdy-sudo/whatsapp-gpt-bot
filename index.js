const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  }
});

client.on('qr', (qr) => {
    console.log('QR ووهه که نوی سیشن غواړې');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ بوټ چالان شو - ويصال احمد');
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
      const reply = chatCompletion.choices[0]?.message?.content || 'پوه نشوم وروره';
      message.reply(reply);
    } catch (error) {
      console.log('Error:', error);
      message.reply('ستونزه راغله وروره 😓');
    }
  }
});

client.initialize();
