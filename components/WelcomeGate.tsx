'use client'

import { useEffect, useState, useCallback } from 'react'
import WelcomeSplash from './WelcomeSplash'

export default function WelcomeGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show if login flow set the flag *this tab session*
    const shouldShow = sessionStorage.getItem('show_welcome_once') === '1'
    if (shouldShow) {
      setShow(true)
      // clear immediately so refresh won't show it again
      sessionStorage.removeItem('show_welcome_once')
    }
  }, [])

  const handleDone = useCallback(() => setShow(false), [])

  return <WelcomeSplash show={show} onDone={handleDone} />
}
