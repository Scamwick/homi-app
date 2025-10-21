export const metadata = {
  title: 'HoMI',
  description: 'HoMI Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
