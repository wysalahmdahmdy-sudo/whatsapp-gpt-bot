const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "wesal-bot" }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ]
  }
});

// 8-رقمي کوډ
client.on('loading_screen', (percent, message) => {
    console.log('⏳ بار کیږي:', percent, message);
});

client.on('qr', (qr) => {
    console.log('=== QR هم کار کوي خو موږ کوډ غواړو ===');
});

client.on('code', (code) => {
    console.log('\n================================');
    console.log('🔥 8-رقمي کوډ:', code);
    console.log('================================');
    console.log('واټساف کې: Settings > Linked Devices > Link with phone number');
    console.log('دا کوډ ولیکه:', code);
    console.log('================================\n');
});

client.on('authenticated', () => {
    console.log('✅ بوټ وصل شو');
});

client.on('ready', () => {
    console.log('✅ واټساف بوټ چالان شو - ويصال احمد');
});

client.on('auth_failure', (msg) => {
    console.error('❌ وصل نشو:', msg);
});

client.on('message', async (message) => {
  const text = message.body.toLowerCase();

  try {
    if (text.includes('ته څوک یې') || text.includes('ته څوک يې') || text.includes('څوک يې ته')) {
        await message.reply('ځار شم وروره! 🙋‍♂️\n\nزه يو رباټ یم، واټساف بوټ یم کنه 😄\nما یو اتل افغان ورور *ويصال احمد* جوړ کړی یم\n\nد هرات د خاورې بچی یم. دلته ستا خدمت ته ولاړ یم 💚\n\n+93706989006 ⚡');
        return;
    }
    else if (text.includes('چیرې یې') || text.includes('چيري يې') || text.includes('چرته يې')) {
        await message.reply('وروره زه همدلته یم کنه 🤖\n\nپه موبایل کې ناست یم، په انټرنیټ کې ګرځم\nخو زما اصل د کندهار، د هرات د میړنیو خلکو سره دی 🇦🇫\n\nما ويصال احمد جوړ کړی یم چې د پښتنو چوپړ وکړم 💚');
        return;
    }
    else if (text.includes('چا جوړ کړی یې') || text.includes('څنګه جوړ شوی یې')) {
        await message.reply('ولا وروره ښه ټپوس دې وکړ 😄\n\nزه د کوډ نه جوړ یم. زما دماغ Llama 3.1 دی\nخو زما بادار یو غښتلی افغان دی: *ويصال احمد* 💪\nد هرات زمری دی 🇦🇫');
        return;
    }
    else if (text.includes('!ping')) {
        await message.reply('🏓 پونګ! بوټ ژوندی دی\n+93706989006 ⚡');
        return;
    }
    else if (text.includes('!info')) {
        await message.reply('🤖 نوم: ويصال بوټ\n📱 نمبر: +93706989006\n🧠 دماغ: Llama 3.1\n🇦🇫 جوړوونکی: ويصال احمد');
        return;
    }
    else if (message.body) {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'ته ويصال بوټ یې. ويصال احمد دې جوړ کړی یې. په کندهاري پښتو لنډ ځواب ورکوه.'
          },
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

// مهم: کوډ 3 ثانیې بعد غواړه
client.initialize();

setTimeout(() => {
    client.requestPairingCode('93706989006').then((code) => {
        console.log('\n🔥🔥 8-رقمي کوډ:', code, '🔥🔥🔥\n');
    }).catch(err => {
        console.log('❌ کوډ ستونزه:', err);
    });
}, 3000);
