'use client'

import { useState } from 'react'

export default function Sidebar({ activeSection, onSectionChange, isConnected }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '🏠',
      description: 'Overview'
    },
    {
      id: 'status',
      name: 'Connection Status',
      icon: '🔗',
      description: 'Bot Status'
    },
    {
      id: 'send-message',
      name: 'Send Message',
      icon: '💬',
      description: 'Send WhatsApp',
      disabled: !isConnected
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: '📨',
      description: 'Incoming Messages',
      disabled: !isConnected
    }
  ]

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-xl border-r border-gray-200
        mobile-menu-transition custom-scrollbar overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📱</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">WhatsApp Bot</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Connection Status Indicator */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              disabled={item.disabled}
              className={`
                sidebar-nav-item focus-enhanced
                ${activeSection === item.id ? 'active' : 'text-gray-700'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>WhatsApp Bot v1.0</p>
            <p>Built with Next.js</p>
          </div>
        </div>
      </div>
    </>
  )
}
