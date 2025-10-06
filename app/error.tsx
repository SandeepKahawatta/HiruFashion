// app/error.tsx
'use client'
import { usePathname } from 'next/navigation'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname()
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>On: {pathname}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
