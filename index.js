client.on('message', async (message) => {
    console.log('>>> نوی مسیج:', message.body);
    console.log('>>> له چا:', message.from);
    console.log('>>> زما دی:', message.fromMe);
    
    if (message.fromMe) {
        console.log('>>> خپل مسیج، ځواب نه ورکوم');
        return;
    }
    
    try {
        await message.reply('✅ بوټ ژوندی دی! تاسو ولیکل: ' + message.body);
        console.log('>>> ځواب واستول شو');
    } catch (err) {
        console.log('>>> Error په ځواب کې:', err.message);
    }
});
