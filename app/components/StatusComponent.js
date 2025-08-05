export default function StatusComponent({ isConnected, onReconnect }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-lg font-medium ${
            isConnected ? 'status-connected' : 'status-disconnected'
          }`}>
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>
        
        <button 
          onClick={onReconnect}
          className="btn-secondary"
        >
          Reconnect
        </button>
      </div>
    </div>
  )
}
