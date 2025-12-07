'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeSplash({
  show,
  onDone,
}: {
  show: boolean
  onDone: () => void
}) {
  const [exit, setExit] = useState(false)

  // Auto close sequence
  useEffect(() => {
    if (!show) return

    // Start exit animation slightly before the total time
    const exitTimer = setTimeout(() => setExit(true), 3500)
    const doneTimer = setTimeout(onDone, 4000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [show, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          {/* Animated Background Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-500/20 blur-[100px]"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/20 blur-[100px]"
              animate={{
                x: [0, -40, 0],
                y: [0, -40, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-pink-500/20 blur-[80px]"
              animate={{
                x: [0, 30, 0],
                y: [0, 50, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          {/* Main Content Container */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo Container */}
            <motion.div
              className="relative w-32 h-32 mb-8 md:w-40 md:h-40"
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-md rotate-3" />
              <div className="absolute inset-0 bg-white/20 rounded-3xl backdrop-blur-md -rotate-3" />
              <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4 overflow-hidden">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/hirufashion-logo.jpg"
                    alt="Hiru Fashion"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="text-center space-y-2 overflow-hidden">
              <motion.h1
                className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              >
                HIRU <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">FASHION</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <p className="text-gray-300 text-sm md:text-base font-light tracking-widest uppercase">
                  Love what you wear
                </p>
              </motion.div>
            </div>

            {/* Loading Indicator */}
            <motion.div
              className="mt-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          </motion.div>

          {/* Curtain Exit Effect (Optional - if we want a curtain reveal) */}
          {/* We are using a simple fade/scale exit above, but we could add overlay panels here if requested */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
