import './globals.css'

export const metadata = {
  title: 'MarketHelper',
  description: 'AI tools for marketplace sellers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
