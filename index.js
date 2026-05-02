const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")
const { Groq } = require("groq-sdk")
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({ auth: state, printQRInTerminal: true })
    sock.ev.on('connection.update', ({ qr }) => {
        if(qr) {
            console.log('*** SCAN THIS QR NOW ***')
            qrcode.generate(qr, {small: true})
        }
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if(!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if(!text) return
        const chat = await groq.chat.completions.create({
            messages: [{ role: 'user', content: text }],
            model: 'llama-3.1-8b-instant'
        })
        await sock.sendMessage(msg.key.remoteJid, { text: chat.choices[0].message.content })
    })
}
startBot()
