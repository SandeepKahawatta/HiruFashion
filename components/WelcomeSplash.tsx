'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeSplash({
  show,
  onDone,
}: {
  show: boolean
  onDone: () => void
}) {
  // Auto close after 2s
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [show, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          // soft pastel sweep background that matches your brand
          style={{
            background:
              'linear-gradient(135deg, #FF6FD8 0%, #FFC36E 30%, #8EE3F5 60%, #F7A8B8 100%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -2 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="relative w-[240px] h-[240px] rounded-3xl shadow-2xl bg-white/10 backdrop-blur-lg ring-1 ring-white/40 overflow-hidden flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="relative w-40 h-40">
                <Image
                  src="/hirufashion-logo.jpg"
                  alt="Hiru Fashion"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2"
              >
                <h1 className="text-white font-extrabold tracking-wide text-xl drop-shadow">
                  HIRU FASHION
                </h1>
                <p className="text-white/90 text-xs">
                  Love what you wear, wear what you love
                </p>
              </motion.div>

              {/* animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-3 h-[3px] w-24 origin-left rounded-full bg-white/80"
              />
            </motion.div>

            {/* subtle corner glow */}
            <div className="pointer-events-none absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-white/30 blur-2xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
