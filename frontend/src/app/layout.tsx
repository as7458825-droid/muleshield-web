import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

export const metadata: Metadata = {
  title: "MuleShield — Mule Account Detection",
  description: "AI-powered mule account detection system for Indian banks. CyberShield 2026, Bank of India × IIT Hyderabad.",
}

export const viewport: Viewport = {
  themeColor: "#0b1220",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}