'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  slug: string
  initialCount: number
}

export function ViewCounter({ slug, initialCount }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount)
  const [hasIncremented, setHasIncremented] = useState(false)

  useEffect(() => {
    // 只在客户端执行一次
    if (!hasIncremented) {
      fetch(`/api/blog/posts/${slug}/view`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCount((prev) => prev + 1)
            setHasIncremented(true)
          }
        })
        .catch((err) => {
          console.error('Failed to increment view count:', err)
        })
    }
  }, [slug, hasIncremented])

  return <>{count}</>
}

