const fs = require('fs')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const pino = require('pino')

// هر ځل زوړ Session پاکوي - نوی کوډ لپاره
if (fs.existsSync('auth_info_baileys')) {
    fs.rmSync('auth_info_baileys', { recursive: true, force: true })
    console.log('🗑️ Session پاک شو')
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['WhatsApp Bot', 'Chrome', '1.0.0']
    })

    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER
        setTimeout(async () => {
            const code = await sock.requestPairingCode(phoneNumber)
            console.log(`\n*** Pairing Code: ${code} ***\n`)
        }, 3000)
    }

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode!== DisconnectReason.loggedOut
            if (shouldReconnect) connectToWhatsApp()
        } else if (connection === 'open') {
            console.log('✅ وټساپ وصل شو!')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message || m.key.fromMe) return
        const text = m.message.conversation || m.message.extendedTextMessage?.text || ''
        const sender = m.key.remoteJid

        if (text === '.ping') await sock.sendMessage(sender, { text: '🏓 زه ژوندی یم!' })
        if (text === '.menu') await sock.sendMessage(sender, { text: '*سلام* 👋\n\n.ping - چک\n.menu - مینو' })
    })
}
connectToWhatsApp()
