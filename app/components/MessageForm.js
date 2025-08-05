'use client'

import { useState } from 'react'

export default function MessageForm({ onSendMessage }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!phoneNumber || !message) {
      alert('Please fill in both phone number and message')
      return
    }

    setIsLoading(true)
    const result = await onSendMessage(phoneNumber, message)
    
    if (result.success) {
      setMessage('')
      alert(result.message)
    } else {
      alert(result.message)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Send Message
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., 6281234567890"
            className="input-field"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="3"
            className="input-field resize-none"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-primary w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
