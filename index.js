const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const axios = require('axios')
const qrcode = require('qrcode-terminal')

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({ auth: state, printQRInTerminal: true })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if(qr) qrcode.generate(qr, {small: true})
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut
            if(shouldReconnect) connectToWhatsApp()
        } else if(connection === 'open') {
            console.log('✅ Bot connected to WhatsApp')
        }
    })

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message || m.key.fromMe) return
        const messageText = m.message.conversation || m.message.extendedTextMessage?.text
        if (!messageText) return

        try {
            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'llama-3.1-70b-versatile',
                messages: [{ role: 'user', content: messageText }]
            }, {
                headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
            })
            const reply = response.data.choices[0].message.content
            await sock.sendMessage(m.key.remoteJid, { text: reply })
        } catch (error) {
            console.log('Error:', error.message)
        }
    })
}
connectToWhatsApp()
