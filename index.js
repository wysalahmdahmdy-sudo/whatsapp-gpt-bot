client.on('message', async (message) => {
    console.log('>>> مسیج راغی:', message.body); // د ټیسټ لپاره
    
    if (message.fromMe) return; // خپل مسیج ته ځواب مه ورکوه
    
    try {
        await message.reply('زما بوټ ځواب: ' + message.body + ' 🤖');
        console.log('>>> ځواب ولیږل شو');
    } catch (err) {
        console.log('>>> Error:', err.message);
    }
});
