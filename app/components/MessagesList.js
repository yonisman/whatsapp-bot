'use client'

import { useEffect, useRef } from 'react'

export default function MessagesList({ messages }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatPhoneNumber = (jid) => {
    // Extract phone number from JID format
    return jid.split('@')[0]
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Incoming Messages
      </h3>
      
      <div className="h-80 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages received yet
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-blue-600">
                  From: {formatPhoneNumber(msg.from)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              
              <div className="text-gray-800 break-words">
                {msg.message || 'No text content'}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length > 0 && (
        <div className="mt-3 text-sm text-gray-500 text-center">
          {messages.length} message{messages.length !== 1 ? 's' : ''} received
        </div>
      )}
    </div>
  )
}
