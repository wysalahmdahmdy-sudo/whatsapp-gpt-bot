const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Groq } = require('groq-sdk');
const axios = require('axios');
const P = require('pino');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

const userGreeted = new Set();

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Chrome (Mac OS)', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('د طلا محمد ويصال رباټ چالان شو ✅');
        }
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = '93706989006';
        setTimeout(async () => {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`*** Pairing Code: ${code} ***`);
        }, 3000);
    }

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (!userGreeted.has(sender)) {
            await sock.sendMessage(sender, { text: 'زه ده طلا محمد ويصال رباټ يم 🤖\nستاسو خدمت کې یم. هر ډول عکس او ډیزاین درته جوړولای شم 🎨' });
            userGreeted.add(sender);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (text.includes('عکس') || text.includes('image') || text.includes('ډیزاین') || text.includes('جوړ کړه') || text.includes('design') || text.includes('انځور')) {
            await sock.sendMessage(sender, { text: '🎨 د طلا محمد ويصال رباټ عکس درته جوړوي... 15 ثانیې صبر وکړه' });

            try {
                const response = await axios.post(
                    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
                    {
                        text_prompts: [{ text: text + ', high quality, 4k, masterpiece, detailed, professional photo' }],
                        cfg_scale: 7,
                        height: 1024,
                        width: 1024,
                        steps: 30,
                        samples: 1,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${STABILITY_API_KEY}`,
                        },
                    }
                );

                const image = response.data.artifacts[0].base64;
                const buffer = Buffer.from(image, 'base64');

                await sock.sendMessage(sender, {
                    image: buffer,
                    caption: `✅ د طلا محمد ويصال رباټ لخوا جوړ شو 🎨\n\nستاسو غوښتنه: ${text}`
                });

            } catch (error) {
                console.error(error);
                await sock.sendMessage(sender, { text: '❌ بخښنه، عکس جوړ نه شو. کریډټ دې خلاص شوی وي' });
            }
        } else {
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: 'system',
                            content: 'ته د طلا محمد ويصال رباټ یې. تل په درنښت او پښتو ځواب ورکوه. ته هر ډول عکس او ډیزاین هم جوړولای شې.'
                        },
                        { role: 'user', content: text }
                    ],
                    model: 'llama-3.1-70b-versatile',
                });
                const reply = chatCompletion.choices[0]?.message?.content || 'پوه نه شوم';
                await sock.sendMessage(sender, { text: reply });
            } catch (error) {
                console.error(error);
            }
        }
    });
}

connectToWhatsApp();
