import './globals.css'

export const metadata = {
  title: 'WhatsApp Bot Dashboard',
  description: 'Dashboard for WhatsApp Bot management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
