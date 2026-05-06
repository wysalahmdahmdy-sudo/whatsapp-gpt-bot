const { Client, LocalAuth } = require('whatsapp-web.js');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "wesal-bot",
    dataPath: "/tmp/.wwebjs_auth"
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--single-process'
    ]
  },
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  }
});

client.on('qr', async (qr) => {
    console.log('QR راغی - اوس کوډ غواړم...');
    try {
        const code = await client.requestPairingCode('93706989006');
        console.log('\n================================');
        console.log('🔥🔥 8-رقمي کوډ:', code, '🔥🔥');
        console.log('================================');
        console.log('واټساف > Settings > Linked Devices');
        console.log('> Link a device > Link with phone number');
        console.log('دا کوډ ولیکه:', code);
        console.log('================================\n');
    } catch (err) {
        console.log('❌ کوډ ستونزه:', err.message);
    }
});

client.on('ready', () => {
    console.log('✅ واټساف بوټ چالان شو - ويصال احمد');
});

client.on('authenticated', () => {
    console.log('✅ بوټ وصل شو');
});

client.on('auth_failure', msg => {
    console.error('❌ وصل نشو:', msg);
});

client.on('message', async (message) => {
  const text = message.body.toLowerCase();
  try {
    if (text.includes('ته څوک یې')) {
        await message.reply('ځار شم وروره! 🙋‍♂️\nزه ويصال بوټ یم\nما ويصال احمد جوړ کړی یم 💚\n+93706989006');
        return;
    }
    else if (message.body) {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'ته ويصال بوټ یې. ويصال احمد دې جوړ کړی یې. په کندهاري پښتو لنډ ځواب ورکوه.' },
          { role: 'user', content: message.body }
        ],
        model: 'llama-3.1-8b-instant'
      });
      const reply = chatCompletion.choices[0]?.message?.content || 'ځواب نشم ورکولی';
      await message.reply(reply);
    }
  } catch (error) {
    console.log('Error:', error);
  }
});

client.initialize();
