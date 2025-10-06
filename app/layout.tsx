import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/lib/cart'
import { ensureAdminSeed } from '@/lib/seed/seed'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fashion Store',
  description: 'A simple fashion store built with Next.js',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await ensureAdminSeed();
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1 container py-8 pt-24">{children}</main>
          <footer className="border-t py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Fashion Store</footer>
        </CartProvider>
      </body>
    </html>
  )
}