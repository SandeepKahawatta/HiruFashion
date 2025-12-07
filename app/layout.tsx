import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import { WishlistProvider } from '@/lib/wishlist-context'
import { ensureAdminSeed } from '@/lib/seed/seed'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fashion Store',
  description: 'A simple fashion store built with Next.js',
  icons: {
    icon: '/avatar.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await ensureAdminSeed();
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}