'use client'

import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Sidebar from './components/Sidebar'
import StatusComponent from './components/StatusComponent'
import QRCodeComponent from './components/QRCodeComponent'
import MessageForm from './components/MessageForm'
import MessagesList from './components/MessagesList'

export default function Dashboard() {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [messages, setMessages] = useState([])
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    // Socket event listeners
    newSocket.on('connection-status', (data) => {
      setIsConnected(data.status === 'connected')
    })

    newSocket.on('qr-code', (qrData) => {
      setQrCode(qrData)
    })

    newSocket.on('new-message', (messageData) => {
      setMessages(prev => [...prev, messageData])
    })

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [])

  const handleReconnect = async () => {
    try {
      await fetch('http://localhost:3000/api/reconnect', { method: 'POST' })
      alert('Reconnection initiated')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleSendMessage = async (number, message) => {
    try {
      const response = await fetch('http://localhost:3000/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number, message })
      })

      const result = await response.json()
      
      if (response.ok) {
        return { success: true, message: 'Message sent successfully!' }
      } else {
        return { success: false, message: 'Error: ' + result.error }
      }
    } catch (error) {
      return { success: false, message: 'Error sending message: ' + error.message }
    }
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">
                Welcome to your WhatsApp Bot management dashboard
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stats-card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Messages Received</p>
                    <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Connection Status</p>
                    <p className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bot Status</p>
                    <p className="text-2xl font-bold text-gray-900">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Component */}
            <StatusComponent isConnected={isConnected} onReconnect={handleReconnect} />
            
            {/* QR Code Section */}
            {qrCode && !isConnected && (
              <QRCodeComponent qrCode={qrCode} />
            )}
          </div>
        )

      case 'status':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Connection Status
              </h1>
              <p className="text-gray-600">
                Monitor your WhatsApp bot connection status
              </p>
            </div>

            <StatusComponent isConnected={isConnected} onReconnect={handleReconnect} />
            
            {qrCode && !isConnected && (
              <QRCodeComponent qrCode={qrCode} />
            )}
          </div>
        )

      case 'send-message':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Send Message
              </h1>
              <p className="text-gray-600">
                Send WhatsApp messages through your bot
              </p>
            </div>

            {isConnected ? (
              <MessageForm onSendMessage={handleSendMessage} />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-yellow-800">Bot Not Connected</h3>
                    <p className="text-yellow-700">Please connect your WhatsApp bot first to send messages.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Incoming Messages
              </h1>
              <p className="text-gray-600">
                View and manage incoming WhatsApp messages
              </p>
            </div>

            {isConnected ? (
              <MessagesList messages={messages} />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-yellow-800">Bot Not Connected</h3>
                    <p className="text-yellow-700">Please connect your WhatsApp bot first to view messages.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return <div>Section not found</div>
    }
  }

  return (
    <>
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isConnected={isConnected}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </>
  )
}
