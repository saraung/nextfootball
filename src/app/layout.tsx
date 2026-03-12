import "@/styles/globals.css"
import Navbar from "@/components/layout/navbar"
import { Bebas_Neue, Space_Grotesk } from "next/font/google"

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

const displayFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="fc-shell">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}