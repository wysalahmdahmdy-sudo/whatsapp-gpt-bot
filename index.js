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
      '--disable-gpu'
    ]
  },
  pairingCode: true,
});

client.on('code', (code) => {
    console.log('*** 8-رقمي کوډ:', code, '***');
    console.log('*** واټساف کې: Settings > Linked Devices > Link with phone number > دا کوډ ولیکه ***');
});

client.on('ready', () => {
    console.log('✅ واټساف بوټ چالان شو - ويصال احمد');
});

client.on('message', async (message) => {
  const text = message.body.toLowerCase();

  try {
    // 1. کندهاري کمانډونه لومړی چک کړه
    if (text.includes('ته څوک یې') || text.includes('ته څوک يې') || text.includes('څوک يې ته')) {
        await message.reply('ځار شم وروره! 🙋‍♂️\n\nزه يو رباټ یم، واټساف بوټ یم کنه 😄\nما یو اتل افغان ورور *ويصال احمد* جوړ کړی یم\n\nد هرات د خاورې بچی یم. دلته ستا خدمت ته ولاړ یم 💚\nهر څه راسره وپوښته وروره\n\n+93706989006 ⚡');
        return;
    }
    else if (text.includes('چیرې یې') || text.includes('چيري يې') || text.includes('چرته يې')) {
        await message.reply('وروره زه همدلته یم کنه 🤖\n\nپه موبایل کې ناست یم، په انټرنیټ کې ګرځم\nخو زما اصل د کندهار، د هرات د میړنیو خلکو سره دی 🇦🇫\n\nما ويصال احمد جوړ کړی یم چې د پښتنو چوپړ وکړم\n\nنور څه امر کوې؟ +93706989006 💚');
        return;
    }
    else if (text.includes('چا جوړ کړی یې') || text.includes('څنګه جوړ شوی یې') || text.includes('who made you')) {
        await message.reply('ولا وروره ښه ټپوس دې وکړ 😄\n\nزه د کوډ او بریښنا نه جوړ یم. زما دماغ Llama 3.1 دی\nخو زما بادار، زما جوړوونکی یو غښتلی افغان دی: *ويصال احمد* 💪\n\nد هرات زمری دی. په مینه یې ما د ټولو پښتنو لپاره جوړ کړم\n\nستا څه خدمت وکړم وروره؟ 🇦🇫⚡');
        return;
    }
    else if (text.includes('سړی یې') || text.includes('انسان یې') || text.includes('بوټ یې')) {
        await message.reply('ههههه نه والله وروره 😂\n\nسړی نه یم، وینه غوښه نه لرم\nزه یو *رباټ* یم، *بوټ* یم، د کمپیوټر بچي یم کنه 💻\n\nخو زړه مې د افغان غوندې تود دی 💚\nما ويصال احمد ددې لپاره جوړ کړم چې درسره خبرې وکړم\n\n+93706989006');
        return;
    }
    else if (text.includes('!ping')) {
        await message.reply('🏓 پونګ! بوټ ژوندی دی\n+93706989006 ⚡');
        return;
    }
    else if (text.includes('!info')) {
        await message.reply('🤖 نوم: ويصال بوټ\n📱 نمبر: +93706989006\n🧠 دماغ: Llama 3.1\n🇦🇫 جوړوونکی: اتل افغان ويصال احمد');
        return;
    }
    else if (text.includes('!help')) {
        await message.reply('📜 کمانډونه:\nسلام - روغبړ\nته څوک یې - پیژندنه\nچیرې یې - ځای\n!ping - بوټ ټیسټ\n!info - معلومات');
        return;
    }

    // 2. که کمانډ نه وي، نو AI ځواب ورکړي
    else if (message.body) {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'ته یو پښتو واټساف بوټ یې. نوم دې ويصال بوټ دی. ويصال احمد دې جوړ کړی یې. په کندهاري پښتو لهجه لنډ او خواږه ځوابونه ورکوه. تل مینه ناک اوسه.'
          },
          { role: 'user', content: message.body }
        ],
        model: 'llama-3.1-8b-instant'
      });
      const reply = chatCompletion.choices[0]?.message?.content || 'ځواب نشم ورکولی وروره';
      await message.reply(reply);
    }

  } catch (error) {
    console.log('Error:', error);
    await message.reply('وبخښه وروره، یوه ستونزه پېښه شوه 😅');
  }
});

client.initialize().then(() => {
  client.requestPairingCode('93706989006');
});
