import type { Metadata } from 'next'
import './globals.css'
import { ApiKeysProvider } from '@/lib/contexts/api-keys-context'

export const metadata: Metadata = {
  title: 'Readdy AI Clone - AI Website Builder',
  description: 'Generate, edit, and publish React-based websites with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ApiKeysProvider>
          {children}
        </ApiKeysProvider>
      </body>
    </html>
  )
}