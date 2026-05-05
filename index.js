const { Client } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('ready', () => console.log('بوټ چالان دی'));

client.on('message', msg => {
    console.log('مسیج:', msg.body);
    
    if (msg.body === 'سلام') msg.reply('وعلیکم السلام +93706989006');
    else if (msg.body === 'ټوکه') msg.reply('29 ساعته وروسته بوټ جوړ شو 😂');
    else msg.reply('سلام ولیکه وروره');
});

client.initialize();
