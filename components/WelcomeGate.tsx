'use client'

import { useEffect, useState, useCallback } from 'react'
import WelcomeSplash from './WelcomeSplash'

export default function WelcomeGate({ initialShow = false }: { initialShow?: boolean }) {
  const [show, setShow] = useState(initialShow)

  useEffect(() => {
    if (initialShow) {
      // Clear the cookie so it doesn't show again on refresh
      document.cookie = 'welcome_toast=; Max-Age=0; path=/;'
    }
  }, [initialShow])

  const handleDone = useCallback(() => setShow(false), [])

  return <WelcomeSplash show={show} onDone={handleDone} />
}
