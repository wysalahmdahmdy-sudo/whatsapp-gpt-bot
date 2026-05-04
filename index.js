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
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

client.on('qr', (qr) => {
  console.log('========== QR CODE ==========');
  qrcode.generate(qr, { small: true });
  console.log('=============================');
  console.log('دا QR کوډ سکن کړئ موبایل کې');
});

client.on('authenticated', () => {
  console.log('✅✅✅ Authentication شو بریالی!');
});

client.on('ready', () => {
  console.log('✅ بوټ چالان شو او WhatsApp سره وصل شو!');
});

client.on('message', async (message) => {
  console.log(`پیغام راغی: ${message.body}`);
  
  if (message.fromMe) return;
  
  try {
    const chat = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'ته یو مرستندویه WhatsApp بوټ یې. په پښتو ژبه لنډ او ګټور ځواب ورکوه.'
        },
        {
          role: 'user',
          content: message.body
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = chat.choices[0]?.message?.content || 'بخښنه غواړم، ځواب نه شم ورکولای';
    await message.reply(reply);
    console.log(`ځواب واستول شو: ${reply}`);
    
  } catch (error) {
    console.error('Groq Error:', error);
    await message.reply('بخښنه غواړم، اوس ستونزه ده. بیا هڅه وکړئ.');
  }
});

client.on('disconnected', (reason) => {
  console.log('بوټ Disconnect شو:', reason);
});

client.initialize();
