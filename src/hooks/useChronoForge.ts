'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { formatEther } from 'viem'

// Contract ABI - Key functions only (would normally import from generated types)
const CHRONO_FORGE_ABI = [
  // Constants
  {
    "inputs": [],
    "name": "MINT_PRICE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CLEANSE_COST", 
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "EVOLUTION_THRESHOLD",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Main functions
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "energize",
    "outputs": [],
    "stateMutability": "nonpayable", 
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "evolve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId1", "type": "uint256"},
      {"internalType": "uint256", "name": "tokenId2", "type": "uint256"}
    ],
    "name": "forge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "uint256", "name": "traitIndex", "type": "uint256"}
    ],
    "name": "cleanse",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "address", "name": "partnerToken", "type": "address"},
      {"internalType": "string", "name": "trait", "type": "string"}
    ],
    "name": "infuse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // View functions
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserTokens",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Helper functions to avoid struct size limits
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getTokenBasicInfo",
    "outputs": [
      {"internalType": "uint256", "name": "energyLevel", "type": "uint256"},
      {"internalType": "uint256", "name": "purity", "type": "uint256"},
      {"internalType": "enum ChronoForge.CoreElement", "name": "coreElement", "type": "uint8"},
      {"internalType": "enum ChronoForge.Generation", "name": "generation", "type": "uint8"},
      {"internalType": "bool", "name": "evolved", "type": "bool"},
      {"internalType": "uint256", "name": "creationTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getTokenEnergyInfo",
    "outputs": [
      {"internalType": "uint256", "name": "lastEnergized", "type": "uint256"},
      {"internalType": "uint256", "name": "currentStreak", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "uint256", "name": "startIndex", "type": "uint256"},
      {"internalType": "uint256", "name": "count", "type": "uint256"}
    ],
    "name": "getTokenTraitsPaginated",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Admin functions
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "bool", "name": "isWhitelisted", "type": "bool"}
    ],
    "name": "whitelistPartnerToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenAttributes",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "energyLevel", "type": "uint256"},
          {"internalType": "uint256", "name": "purity", "type": "uint256"},
          {"internalType": "enum ChronoForge.CoreElement", "name": "coreElement", "type": "uint8"},
          {"internalType": "enum ChronoForge.Generation", "name": "generation", "type": "uint8"},
          {"internalType": "string[]", "name": "infusedTraits", "type": "string[]"},
          {"internalType": "uint256", "name": "lastEnergized", "type": "uint256"},
          {"internalType": "uint256", "name": "currentStreak", "type": "uint256"},
          {"internalType": "bool", "name": "evolved", "type": "bool"},
          {"internalType": "uint256", "name": "creationTime", "type": "uint256"}
        ],
        "internalType": "struct ChronoForge.AetheriumAttributes",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBasicStats",
    "outputs": [
      {"internalType": "uint256", "name": "totalMinted", "type": "uint256"},
      {"internalType": "uint256", "name": "totalEvolved", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract address (would be set from environment or deployment)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CHRONO_FORGE_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

// Validate contract address
if (typeof window !== 'undefined' && CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
  console.warn('ChronoForge: Contract address not set. Please set NEXT_PUBLIC_CHRONO_FORGE_ADDRESS in .env.local')
}

export interface NFTAttributes {
  energyLevel: bigint
  purity: bigint
  coreElement: number
  generation: number
  infusedTraits: string[]
  lastEnergized: bigint
  currentStreak: bigint
  evolved: boolean
  creationTime: bigint
}

export function useChronoForge() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read contract constants
  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHRONO_FORGE_ABI,
    functionName: 'MINT_PRICE',
  })

  const { data: cleanseCost } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHRONO_FORGE_ABI,
    functionName: 'CLEANSE_COST',
  })

  const { data: evolutionThreshold } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHRONO_FORGE_ABI,
    functionName: 'EVOLUTION_THRESHOLD',
  })

  // Read user's NFTs
  const { data: userTokens, refetch: refetchUserTokens, isLoading: tokensLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHRONO_FORGE_ABI,
    functionName: 'getUserTokens',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Get user's AVAX balance
  const { data: avaxBalance } = useBalance({
    address: address,
    query: {
      enabled: !!address,
    },
  })

  // Read user's NFT count
  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHRONO_FORGE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Hook to get NFT attributes using helper functions to avoid data limits
  const useTokenAttributes = (tokenId: number) => {
    // Get basic info (energy, purity, element, generation, evolved, creation time)
    const basicInfoResult = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CHRONO_FORGE_ABI,
      functionName: 'getTokenBasicInfo',
      args: [BigInt(tokenId)],
      query: {
        enabled: tokenId >= 0,
        staleTime: 2000,
      },
    })

    // Get energy info (last energized, current streak)
    const energyInfoResult = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CHRONO_FORGE_ABI,
      functionName: 'getTokenEnergyInfo',
      args: [BigInt(tokenId)],
      query: {
        enabled: tokenId >= 0,
        staleTime: 2000,
      },
    })

    // Get traits (paginated to avoid large arrays)
    const traitsResult = useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CHRONO_FORGE_ABI,
      functionName: 'getTokenTraitsPaginated',
      args: [BigInt(tokenId), BigInt(0), BigInt(10)], // Get first 10 traits
      query: {
        enabled: tokenId >= 0,
        staleTime: 2000,
      },
    })

    // Combine the data
    let data = null
    let error = null
    const isLoading = basicInfoResult.isLoading || energyInfoResult.isLoading || traitsResult.isLoading

    if (basicInfoResult.error || energyInfoResult.error || traitsResult.error) {
      error = basicInfoResult.error || energyInfoResult.error || traitsResult.error
    } else if (basicInfoResult.data && energyInfoResult.data) {
      const [energyLevel, purity, coreElement, generation, evolved, creationTime] = basicInfoResult.data
      const [lastEnergized, currentStreak] = energyInfoResult.data
      const infusedTraits = traitsResult.data || []

      data = {
        energyLevel,
        purity,
        coreElement: Number(coreElement),
        generation: Number(generation),
        infusedTraits: [...infusedTraits], // Convert to mutable array
        lastEnergized,
        currentStreak,
        evolved,
        creationTime,
      }
    }

    return {
      data,
      error,
      isLoading,
      refetch: () => {
        basicInfoResult.refetch()
        energyInfoResult.refetch()
        traitsResult.refetch()
      }
    }
  }

  // Contract interactions
  const mint = async () => {
    if (!isConnected || !mintPrice) return

    try {
      setIsLoading(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CHRONO_FORGE_ABI,
        functionName: 'mint',
        value: mintPrice,
      })
    } catch (err) {
      console.error('Error minting:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const energize = async (tokenId: number) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CHRONO_FORGE_ABI,
        functionName: 'energize',
        args: [BigInt(tokenId)],
      })
    } catch (err) {
      console.error('Error energizing:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const evolve = async (tokenId: number) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CHRONO_FORGE_ABI,
        functionName: 'evolve',
        args: [BigInt(tokenId)],
      })
    } catch (err) {
      console.error('Error evolving:', err)
      setIsLoading(false) // Only set to false on error
    }
  }

  const forge = async (tokenId1: number, tokenId2: number) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CHRONO_FORGE_ABI,
        functionName: 'forge',
        args: [BigInt(tokenId1), BigInt(tokenId2)],
      })
    } catch (err) {
      console.error('Error forging:', err)
      setIsLoading(false) // Only set to false on error
    }
  }

  const cleanse = async (tokenId: number, traitIndex: number) => {
    if (!isConnected || !cleanseCost) return

    try {
      setIsLoading(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CHRONO_FORGE_ABI,
        functionName: 'cleanse',
        args: [BigInt(tokenId), BigInt(traitIndex)],
        value: cleanseCost,
      })
    } catch (err) {
      console.error('Error cleansing:', err)
      setIsLoading(false) // Only set to false on error
    }
  }

  const infuse = async (tokenId: number, partnerToken: string, trait: string) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CHRONO_FORGE_ABI,
        functionName: 'infuse',
        args: [BigInt(tokenId), partnerToken as `0x${string}`, trait],
      })
    } catch (err) {
      console.error('Error infusing:', err)
      setIsLoading(false) // Only set to false on error
    }
  }

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('Transaction confirmed, refreshing data...')
      setIsLoading(false) // Clear loading state on confirmation
      // Small delay to ensure blockchain state is updated
      setTimeout(() => {
        refetchUserTokens()
      }, 2000)
    }
  }, [isConfirmed, hash, refetchUserTokens])

  return {
    // State
    isConnected,
    isLoading: isLoading || isPending || isConfirming,
    isConfirmed,
    isConfirming,
    hash,
    error,
    
    // Contract data
    mintPrice: mintPrice ? formatEther(mintPrice) : undefined,
    cleanseCost: cleanseCost ? formatEther(cleanseCost) : undefined,
    evolutionThreshold: evolutionThreshold?.toString(),
    userTokens: userTokens as bigint[] | undefined,
    balance: avaxBalance ? formatEther(avaxBalance.value) : undefined,
    nftCount: nftBalance?.toString(),
    tokensLoading,
    
    // Actions
    mint,
    energize,
    evolve,
    forge,
    cleanse,
    infuse,
    
    // Utilities
    useTokenAttributes,
    refetchUserTokens,
  }
}

// Hook for ecosystem statistics
export function useEcosystemStats() {
  const [dailyEnergizers, setDailyEnergizers] = useState<number>(0)
  const [activeHolders, setActiveHolders] = useState<number>(0)

  const { data: basicStats, error, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CHRONO_FORGE_ABI,
    functionName: 'getBasicStats',
    query: {
      enabled: CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      staleTime: 10000, // Cache for 10 seconds
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  })

  // Debug logging
  useEffect(() => {
    console.log('useEcosystemStats Debug:', {
      CONTRACT_ADDRESS,
      basicStats,
      isLoading,
      error: error?.message || error,
      envAddress: process.env.NEXT_PUBLIC_CHRONO_FORGE_ADDRESS
    })
  }, [basicStats, isLoading, error])

  // Simulate daily energizers count (in a real app, this would come from events)
  useEffect(() => {
    const updateDailyStats = () => {
      // Simulate some daily activity based on total minted
      const totalMinted = basicStats ? Number(basicStats[0]) : 0
      const simulatedDailyEnergizers = Math.floor(totalMinted * 0.15) // 15% of holders energize daily
      const simulatedActiveHolders = Math.floor(totalMinted * 0.8) // 80% of minted are held by active users
      
      setDailyEnergizers(simulatedDailyEnergizers)
      setActiveHolders(simulatedActiveHolders)
    }

    if (basicStats) {
      updateDailyStats()
    }
  }, [basicStats])

  return {
    data: basicStats ? {
      totalMinted: Number(basicStats[0]),
      totalEvolved: Number(basicStats[1]),
      activeHolders,
      dailyEnergizers,
      averageEnergyLevel: 42 // Placeholder - would calculate from all tokens
    } : null,
    error,
    isLoading
  }
}
