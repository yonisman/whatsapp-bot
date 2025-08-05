export default function QRCodeComponent({ qrCode }) {
  return (
    <div className="card">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Scan QR Code with WhatsApp
        </h3>
        
        <div className="flex justify-center mb-4">
          <img 
            src={qrCode} 
            alt="QR Code" 
            className="max-w-xs border-2 border-gray-200 rounded-lg shadow-sm"
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <span className="font-medium">Instructions:</span><br />
            Open WhatsApp → Settings → Linked Devices → Link a Device
          </p>
        </div>
      </div>
    </div>
  )
}
