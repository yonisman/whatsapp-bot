# WhatsApp Bot Dashboard - Next.js

A modern WhatsApp bot dashboard built with Next.js, React, and Tailwind CSS.

## Features

- 🚀 Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 🔄 Real-time communication with Socket.IO
- 📱 Responsive design
- 🤖 WhatsApp bot integration with Baileys

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

You need to run both the backend server and the Next.js frontend:

1. **Start the WhatsApp Bot Server** (Terminal 1):
```bash
npm run server
```
This will start the Express.js server with Socket.IO on port 3000.

2. **Start the Next.js Frontend** (Terminal 2):
```bash
npm run dev
```
This will start the Next.js development server on port 3001.

3. **Access the Dashboard**:
Open your browser and go to: `http://localhost:3001`

### Production Build

To build for production:

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   │   ├── StatusComponent.js
│   │   ├── QRCodeComponent.js
│   │   ├── MessageForm.js
│   │   └── MessagesList.js
│   ├── globals.css         # Global styles with Tailwind
│   ├── layout.js          # Root layout
│   └── page.js            # Main dashboard page
├── auth_info_baileys/     # WhatsApp authentication data
├── public/                # Static files
├── server.js              # Express.js backend server
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── next.config.js         # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run server` - Start WhatsApp bot backend server
- `npm run lint` - Run ESLint

## Technologies Used

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Express.js, Socket.IO
- **WhatsApp Integration**: @whiskeysockets/baileys
- **Styling**: Tailwind CSS with custom components
- **Real-time Communication**: Socket.IO

## Usage

1. Start both servers as described above
2. Open the dashboard in your browser
3. Scan the QR code with WhatsApp to connect your bot
4. Once connected, you can send messages and view incoming messages
5. Use the reconnect button if the connection is lost

## Notes

- The backend server runs on port 3000
- The Next.js frontend runs on port 3001
- Make sure both ports are available
- WhatsApp authentication data is stored in the `auth_info_baileys` folder
