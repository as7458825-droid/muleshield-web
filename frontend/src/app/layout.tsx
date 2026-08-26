import type { Metadata, Viewport } from "next"
import { Inter, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
})

export const metadata: Metadata = {
  title: "MuleShield — Mule Account Detection",
  description: "AI-powered mule account detection system for Indian banks. CyberShield 2026, Bank of India × IIT Hyderabad.",
}

export const viewport: Viewport = {
  themeColor: "#0a0f1c",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}