'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class Web3ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a WebSocket/transport related error
    const isWebSocketError = 
      error.message?.includes('socket') ||
      error.message?.includes('transport') ||
      error.message?.includes('relayer') ||
      error.message?.includes('WebSocket')

    if (isWebSocketError) {
      console.warn('WebSocket connection error caught by boundary:', error.message)
      // Don't show error UI for WebSocket issues, just log them
      return { hasError: false }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Web3ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-slate-400 mb-4">There was an error loading the Web3 connection.</p>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
