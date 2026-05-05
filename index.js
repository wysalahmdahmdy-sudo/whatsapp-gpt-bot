client.on('message_create', async (message) => {
    if (message.fromMe) return;
    if (message.isGroupMsg) return;
    
    const msg = message.body.trim(); // toLowerCase لرې شو
    console.log('>>> نوی مسیج:', message.body);
    
    try {
        if (msg.includes('سلام')) {
            await message.reply('💚🤖 وعلیکم السلام وروره!\nزه د +93706989006 بوټ یم\n\n`!help` ولیکه');
        }
        else if (msg.includes('ټوکه') || msg.includes('جوق') || msg === '!joke') {
            const jokes = [
                'ولې +93706989006 بوټ تل خوشحاله دی؟ ځکه Crash نه کیږي! 😂🚀',
                'افغان له بوټ نه وپوښتل: پښتو پوهېږې؟ بوټ وویل: له تا نه ښه 😂🇦🇫',
                '29 ساعته کوډ وهل اسانه دي خو بوټ چلول سخت دي 😂💪',
                'بوټ ته یې وویل ستړی مه شې، ويې ویل: زه خو په Railway یم 🤖'
            ];
            await message.reply(jokes[Math.floor(Math.random() * jokes.length)]);
        }
        else if (msg.includes('پښتو') || msg.includes('پوهېږې') || msg.includes('پوهیږي') || msg.includes('هیري')) {
            await message.reply('هو وروره! زه پښتو ډېره ښه پوهېږم 🇦🇫💚\n\n`ټوکه` ولیکه چې وخاندو 😂\nیا `!help` ولیکه');
        }
        else if (msg.includes('کمانډ') || msg === '!help') {
            await message.reply(`🤖 د +93706989006 بوټ کمانډونه:\n\n!time - وخت\n!joke - ټوکه\n!ping - بوټ ژوندی دی\nسلام - روغبړ\nټوکه - یوه ټوکه\nپښتو - خبرې کوم 💚`);
        }
        else if (msg.includes('چا جوړ') || msg.includes('څوک یې جوړ')) {
            await message.reply('زه د +93706989006 نمبر خاوند 29 ساعته کې جوړ کړم! 🇦🇫💪');
        }
        else if (msg.includes('څه کولای شې') || msg.includes('کولای شي')) {
            await message.reply(`🤖 زه د +93706989006 بوټ یم\n\nزما کارونه:\n1. سلام 🤝\n2. ټوکه 😂\n3. وخت ⏰\n4. پښتو خبرې 🇦🇫\n\n`!help` ولیکه`);
        }
        else if (msg === '!time' || msg.includes('وخت')) {
            const time = new Date().toLocaleTimeString('fa-AF', {timeZone: 'Asia/Kabul'});
            await message.reply('⏰ د افغانستان وخت: ' + time + '\nبوټ: +93706989006');
        }
        else if (msg.includes('شمیره') || msg.includes('نمبر')) {
            await message.reply('زما د مالک شمیره ده: +93706989006 📱');
        }
        else if (msg === '!ping') {
            await message.reply('Pong! 🏓\nبوټ 100% ژوندی دی\nشمیره: +93706989006 🚀');
        }
        else {
            await message.reply('وروره پښتو پوهېږم خو پدې پوه نشوم 🤔\n\n`ټوکه` ولیکه یا `!help` ولیکه');
        }
    } catch (err) {
        console.log('>>> Error:', err.message);
    }
});
