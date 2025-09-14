import { http, createConfig } from 'wagmi'
import { avalancheFuji } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Create config singleton to prevent multiple WalletConnect initializations
let wagmiConfig: ReturnType<typeof createConfig> | null = null

function createWagmiConfig() {
  // Create connectors array with proper typing
  const connectors = []
  
  // Add base connectors
  connectors.push(injected())
  connectors.push(metaMask())
  connectors.push(safe())
  
  // Only add WalletConnect if projectId is provided and valid
  if (projectId && projectId.length > 0) {
    // Use appropriate URL based on environment
    const appUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NODE_ENV === 'production' 
        ? 'https://chrono-forge.app' 
        : 'http://localhost:3000'
    
    connectors.push(walletConnect({ 
      projectId,
      metadata: {
        name: 'Chrono-Forge',
        description: 'Dynamic NFTs that evolve through on-chain interactions',
        url: appUrl,
        icons: [`${appUrl}/icon.png`]
      },
      showQrModal: true,
    }))
  }
  
  return createConfig({
    chains: [avalancheFuji],
    connectors,
    transports: {
      [avalancheFuji.id]: http(),
    },
  })
}

export const config = (() => {
  if (!wagmiConfig) {
    wagmiConfig = createWagmiConfig()
  }
  return wagmiConfig
})()

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
