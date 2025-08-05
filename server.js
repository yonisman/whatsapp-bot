const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

let sock = null
let qrCodeData = null
let isConnected = false

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // Disable terminal QR
    })

    // QR Code event
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr) {
            // Generate QR code as data URL
            qrCodeData = await qrcode.toDataURL(qr)
            io.emit('qr-code', qrCodeData)
            console.log('QR Code generated')
        }
        
        if (connection === 'close') {
            isConnected = false
            io.emit('connection-status', { status: 'disconnected' })
            
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Connection closed:', lastDisconnect.error, 'Reconnecting:', shouldReconnect)
            
            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, 3000)
            }
        } else if (connection === 'open') {
            isConnected = true
            qrCodeData = null
            io.emit('connection-status', { status: 'connected' })
            console.log('WhatsApp connected!')
        }
    })

    sock.ev.on('creds.update', saveCreds)

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.key.fromMe && m.type === 'notify') {
            const messageData = {
                from: msg.key.remoteJid,
                message: msg.message?.conversation || msg.message?.extendedTextMessage?.text,
                timestamp: new Date()
            }
            io.emit('new-message', messageData)
        }
    })
}

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        connected: isConnected,
        hasQR: !!qrCodeData
    })
})

app.get('/api/qr', (req, res) => {
    if (qrCodeData) {
        res.json({ qr: qrCodeData })
    } else {
        res.status(404).json({ error: 'No QR code available' })
    }
})

app.post('/api/send-message', async (req, res) => {
    try {
        const { number, message } = req.body
        
        if (!isConnected) {
            return res.status(400).json({ error: 'WhatsApp not connected' })
        }

        const jid = number.includes('@') ? number : `${number}@s.whatsapp.net`
        await sock.sendMessage(jid, { text: message })
        
        res.json({ success: true, message: 'Message sent' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/reconnect', (req, res) => {
    connectToWhatsApp()
    res.json({ message: 'Reconnection initiated' })
})

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected')
    
    // Send current status to new client
    socket.emit('connection-status', { status: isConnected ? 'connected' : 'disconnected' })
    
    if (qrCodeData) {
        socket.emit('qr-code', qrCodeData)
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`WhatsApp Bot Server running on port ${PORT}`)
    console.log(`Next.js Frontend will run on port 3001`)
    connectToWhatsApp()
})
