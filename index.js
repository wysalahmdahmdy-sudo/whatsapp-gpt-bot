const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({ auth: state, printQRInTerminal: true })

    sock.ev.on('connection.update', async (u) => {
        if (u.connection === 'open') console.log('✅ وصل شو +93706989006')
        if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode("93706989006")
            console.log('>>> 8 رقمي کوډ:', code)
        }
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || ''
        if (text.includes('سلام')) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'وعلیکم السلام +93706989006 💚' })
        }
    })
}
start()
