'use client'

import React, { ReactNode, useEffect } from 'react'
import { config } from '@/lib/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

// Create QueryClient outside component to prevent re-initialization
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: Error | null) => {
        // Don't retry on WebSocket errors
        if (error?.message?.includes('socket') || error?.message?.includes('transport')) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

let queryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: always create a new query client
    return createQueryClient()
  } else {
    // Client-side: use singleton pattern
    if (!queryClientSingleton) queryClientSingleton = createQueryClient()
    return queryClientSingleton
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  // Get the singleton query client
  const queryClient = getQueryClient()

  useEffect(() => {
    // Handle WebSocket errors globally
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('socket') || 
          event.reason?.message?.includes('transport') ||
          event.reason?.message?.includes('relayer')) {
        console.warn('WebSocket connection issue:', event.reason.message)
        event.preventDefault() // Prevent the error from being logged as unhandled
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
