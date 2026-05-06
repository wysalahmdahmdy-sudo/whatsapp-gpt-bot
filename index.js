const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

console.log('🚀 بوټ شروع کیږي...');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "wesal-bot" }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote'
    ]
  }
});

// مهم: دا ایونټ کوډ ښي
client.on('loading_screen', (percent, message) => {
    console.log('⏳ بار کیږي:', percent);
});

client.on('ready', async () => {
    console.log('✅ بوټ تیار دی');
    // اوس کوډ وغواړه
    try {
        const code = await client.requestPairingCode('93706989006');
        console.log('\n================================');
        console.log('🔥🔥 8-رقمي کوډ:', code, '🔥🔥');
        console.log('================================');
        console.log('واټساف > Settings > Linked Devices > Link with phone number');
        console.log('================================\n');
    } catch (err) {
        console.log('❌ د کوډ ستونزه:', err.message);
    }
});

client.on('authenticated', () => {
    console.log('✅ وصل شو');
});

client.on('auth_failure', (msg) => {
    console.error('❌ وصل نشو:', msg);
});

// کندهاري ځوابونه
client.on('message', async (message) => {
  const text = message.body.toLowerCase();
  try {
    if (text.includes('ته څوک یې') || text.includes('ته څوک يې')) {
        await message.reply('ځار شم وروره! 🙋‍♂️\n\nزه يو رباټ یم کنه 😄\nما *ويصال احمد* جوړ کړی یم\n\nد هرات بچی یم 💚\n\n+93706989006 ⚡');
        return;
    }
    else if (text.includes('چیرې یې') || text.includes('چيري يې')) {
        await message.reply('وروره زه همدلته یم کنه 🤖\n\nما ويصال احمد جوړ کړی یم چې د پښتنو چوپړ وکړم 💚');
        return;
    }
    else if (message.body) {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: message.body }],
        model: 'llama-3.1-8b-instant'
      });
      const reply = chatCompletion.choices[0]?.message?.content || 'ځواب نشم ورکولی';
      await message.reply(reply);
    }
  } catch (error) {
    console.log('Error:', error);
  }
});

console.log('📡 Initialize کیږي...');
client.initialize();
