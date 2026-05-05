const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '22.04.4']
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('>>> وصل قطع شو:', lastDisconnect.error, ', بیا وصلېږم:', shouldReconnect)
            if(shouldReconnect) startBot()
            
        } else if(connection === 'open') {
            console.log('✅✅✅ بوټ وصل شو +93706989006 ✅✅✅')
        }
        
        if(update.qr) {
            console.log('>>> QR راځي خو موږ کوډ غواړو')
        }
    })

    // 8 رقمي کوډ
    if(!sock.authState.creds.registered) {
        setTimeout(async () => {
            const code = await sock.requestPairingCode("93706989006")
            console.log('========================================')
            console.log('>>> 8 رقمي کوډ +93706989006:', code)
            console.log('>>> WhatsApp > Linked Devices کې یې ولیکه')
            console.log('========================================')
        }, 3000)
    }

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages
