'use client'

import { useState, useEffect } from 'react'
import { useChronoForge } from '@/hooks/useChronoForge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Sparkles } from 'lucide-react'
import { WalletConnect } from '@/components/WalletConnect'
import './flip-card.css'

const CORE_ELEMENTS = {
  0: { name: 'None', color: 'bg-gray-500', icon: '⚫' },
  1: { name: 'Aqua', color: 'bg-blue-500', icon: '💧' },
  2: { name: 'Terra', color: 'bg-amber-600', icon: '🌍' },
  3: { name: 'Pyro', color: 'bg-red-500', icon: '🔥' },
  4: { name: 'Aero', color: 'bg-cyan-400', icon: '💨' },
  5: { name: 'Umbra', color: 'bg-purple-600', icon: '🌙' },
}

const GENERATIONS = {
  0: 'Gen-1',
  1: 'Gen-2', 
  2: 'Gen-3',
  3: 'Gen-4',
  4: 'Gen-5',
}

interface NFTCardProps {
  tokenId: number
}

export function NFTCard({ tokenId }: NFTCardProps) {
  const { 
    userTokens, 
    energize, 
    evolve, 
    infuse, 
    cleanse, 
    forge, 
    isLoading,
    error,
    isConfirming,
    isConfirmed,
    hash,
    useTokenAttributes
  } = useChronoForge()
  
  // Get token attributes using the hook
  const { data: attributes, isLoading: attributesLoading, refetch: refetchAttributes } = useTokenAttributes(tokenId)
  
  const [isFlipped, setIsFlipped] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))

  // Helper function to determine trait rarity and styling
  const getTraitRarity = (trait: string) => {
    // Common traits
    const common = ["Ember Spark", "Frost Touch", "Wind Whisper", "Stone Heart", "Water Drop", "Lightning Flicker", "Shadow Wisp", "Light Gleam", "Nature's Blessing", "Metal Core"]
    
    // Rare traits  
    const rare = ["Inferno Mastery", "Glacier Command", "Storm Caller", "Earthquake Fist", "Tsunami Wave", "Void Walker", "Prism Shield", "Crystal Resonance", "Phoenix Feather", "Dragon Scale"]
    
    // Epic traits
    const epic = ["Cosmic Nexus", "Temporal Flux", "Astral Projection", "Quantum Entanglement", "Reality Tear", "Soul Forge", "Dimensional Anchor", "Ethereal Phase", "Celestial Crown", "Abyssal Gate"]
    
    // Legendary traits
    const legendary = ["Genesis Core", "Omega Synthesis", "Infinity Matrix", "Universe Heart", "Creation Spark", "Destruction Echo", "Time Lord's Seal", "Space Weaver", "Fate Binder", "Chaos Engine"]
    
    // Mythical traits
    const mythical = ["World Shaper", "Reality Architect", "Omnipotent Will", "Divine Mandate", "Primordial Force"]
    
    if (common.includes(trait)) {
      return {
        rarity: 'Common',
        emoji: '⚪',
        bgColor: 'from-gray-500/10 to-slate-500/10',
        borderColor: 'border-gray-500/40',
        textColor: 'text-gray-300',
        glowColor: 'hover:shadow-gray-500/20'
      }
    } else if (rare.includes(trait)) {
      return {
        rarity: 'Rare',
        emoji: '🔵',
        bgColor: 'from-blue-500/10 to-cyan-500/10',
        borderColor: 'border-blue-500/40',
        textColor: 'text-blue-300',
        glowColor: 'hover:shadow-blue-500/20'
      }
    } else if (epic.includes(trait)) {
      return {
        rarity: 'Epic',
        emoji: '🟣',
        bgColor: 'from-purple-500/10 to-violet-500/10',
        borderColor: 'border-purple-500/40',
        textColor: 'text-purple-300',
        glowColor: 'hover:shadow-purple-500/20'
      }
    } else if (legendary.includes(trait)) {
      return {
        rarity: 'Legendary',
        emoji: '🟠',
        bgColor: 'from-orange-500/10 to-amber-500/10',
        borderColor: 'border-orange-500/40',
        textColor: 'text-orange-300',
        glowColor: 'hover:shadow-orange-500/20'
      }
    } else if (mythical.includes(trait)) {
      return {
        rarity: 'Mythical',
        emoji: '🌟',
        bgColor: 'from-yellow-500/10 to-pink-500/10',
        borderColor: 'border-yellow-500/40',
        textColor: 'text-yellow-300',
        glowColor: 'hover:shadow-yellow-500/20'
      }
    } else {
      // Legacy traits (old system)
      return {
        rarity: 'Legacy',
        emoji: '✨',
        bgColor: 'from-purple-500/10 to-pink-500/10',
        borderColor: 'border-purple-500/40',
        textColor: 'text-purple-300',
        glowColor: 'hover:shadow-purple-500/20'
      }
    }
  }

  // Dynamic cooldown timer - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle transaction confirmation and refresh data
  useEffect(() => {
    if (isConfirmed && hash && actionLoading) {
      console.log(`Transaction confirmed for ${actionLoading}, refreshing NFT #${tokenId} data...`)
      // Small delay to ensure blockchain state is updated
      setTimeout(() => {
        refetchAttributes()
        setActionLoading(null)
      }, 1500)
    }
  }, [isConfirmed, hash, actionLoading, refetchAttributes, tokenId])

  if (error && (error as Error)?.message?.includes('out of bounds')) {
    return (
      <Card className="w-full max-w-sm border-red-600 bg-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-red-400">
            Aetherium Shard #{tokenId}
            <Badge variant="destructive" className="bg-red-600">Data Error</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center p-6 rounded-lg bg-gradient-to-br from-red-800/30 to-red-900/30">
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-red-300 text-sm">Contract data limit exceeded</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!attributes && attributesLoading) {
    return (
      <Card className="w-full max-w-sm border-slate-700 bg-slate-900/50">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">Loading NFT #{tokenId}...</div>
        </CardContent>
      </Card>
    )
  }

  if (!attributes) {
    return (
      <Card className="w-full max-w-sm border-slate-700 bg-slate-900/50">
        <CardContent className="p-6 text-center">
          <div className="text-slate-400">No data available</div>
        </CardContent>
      </Card>
    )
  }

  const element = CORE_ELEMENTS[attributes.coreElement as keyof typeof CORE_ELEMENTS] || CORE_ELEMENTS[0]
  const generation = GENERATIONS[attributes.generation as keyof typeof GENERATIONS] || 'Gen-1'
  
  const canEnergize = () => {
    if (!attributes) return false
    const lastEnergized = Number(attributes.lastEnergized)
    const dayInSeconds = 24 * 60 * 60
    return currentTime - lastEnergized >= dayInSeconds
  }

  const getEnergizeCooldown = () => {
    if (!attributes) return null
    const lastEnergized = Number(attributes.lastEnergized)
    const dayInSeconds = 24 * 60 * 60
    const remaining = dayInSeconds - (currentTime - lastEnergized)
    
    if (remaining <= 0) return null
    
    const hours = Math.floor(remaining / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)
    const seconds = remaining % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  const getEnergyGain = () => {
    if (!attributes) return 10
    const currentStreak = Number(attributes.currentStreak)
    return currentStreak >= 7 ? 20 : 10
  }

  const canEvolve = () => {
    if (!attributes) return false
    return Number(attributes.energyLevel) >= 100 && !attributes.evolved && Number(attributes.purity) >= 80
  }

  const handleEnergize = async () => {
    setActionLoading('energize')
    try {
      await energize(tokenId)
      // Don't clear loading state here - let useEffect handle it after confirmation
    } catch (error) {
      console.error('Failed to energize NFT:', error)
      setActionLoading(null)
    }
  }

  const handleEvolve = async () => {
    setActionLoading('evolve')
    try {
      await evolve(tokenId)
      // Don't clear loading state here - let useEffect handle it after confirmation
    } catch (error) {
      console.error('Failed to evolve NFT:', error)
      setActionLoading(null)
    }
  }

  const handleInfuse = async () => {
    // In a real implementation, users would select from their owned partner tokens
    // For demo purposes, we'll use a whitelisted demonstration token
    // This should be replaced with actual partner token selection UI
    const demoPartnerToken = "0x1234567890123456789012345678901234567890"
    
    // TODO: Replace with actual partner token selection from user's wallet
    // const selectedPartnerToken = await getUserSelectedPartnerToken()
    
    // Comprehensive trait system with categories and rarities
    const traitSystem = {
      // Common traits (60% chance)
      common: [
        "Ember Spark", "Frost Touch", "Wind Whisper", "Stone Heart", "Water Drop",
        "Lightning Flicker", "Shadow Wisp", "Light Gleam", "Nature's Blessing", "Metal Core"
      ],
      
      // Rare traits (25% chance)  
      rare: [
        "Inferno Mastery", "Glacier Command", "Storm Caller", "Earthquake Fist", "Tsunami Wave",
        "Void Walker", "Prism Shield", "Crystal Resonance", "Phoenix Feather", "Dragon Scale"
      ],
      
      // Epic traits (12% chance)
      epic: [
        "Cosmic Nexus", "Temporal Flux", "Astral Projection", "Quantum Entanglement", "Reality Tear",
        "Soul Forge", "Dimensional Anchor", "Ethereal Phase", "Celestial Crown", "Abyssal Gate"
      ],
      
      // Legendary traits (2.8% chance)
      legendary: [
        "Genesis Core", "Omega Synthesis", "Infinity Matrix", "Universe Heart", "Creation Spark",
        "Destruction Echo", "Time Lord's Seal", "Space Weaver", "Fate Binder", "Chaos Engine"
      ],
      
      // Mythical traits (0.2% chance)
      mythical: [
        "World Shaper", "Reality Architect", "Omnipotent Will", "Divine Mandate", "Primordial Force"
      ]
    }
    
    // Determine rarity based on weighted random
    const random = Math.random() * 100
    let selectedTrait: string
    
    if (random < 60) {
      // Common (60%)
      const commonTraits = traitSystem.common
      selectedTrait = commonTraits[Math.floor(Math.random() * commonTraits.length)]
    } else if (random < 85) {
      // Rare (25%)  
      const rareTraits = traitSystem.rare
      selectedTrait = rareTraits[Math.floor(Math.random() * rareTraits.length)]
    } else if (random < 97) {
      // Epic (12%)
      const epicTraits = traitSystem.epic
      selectedTrait = epicTraits[Math.floor(Math.random() * epicTraits.length)]
    } else if (random < 99.8) {
      // Legendary (2.8%)
      const legendaryTraits = traitSystem.legendary
      selectedTrait = legendaryTraits[Math.floor(Math.random() * legendaryTraits.length)]
    } else {
      // Mythical (0.2%)
      const mythicalTraits = traitSystem.mythical  
      selectedTrait = mythicalTraits[Math.floor(Math.random() * mythicalTraits.length)]
    }
    
    setActionLoading('infuse')
    try {
      await infuse(tokenId, demoPartnerToken, selectedTrait)
      // Don't clear loading state here - let useEffect handle it after confirmation
    } catch (error) {
      console.error('Failed to infuse trait:', error)
      setActionLoading(null)
    }
  }

  const handleCleanse = async (traitIndex: number) => {
    setActionLoading('cleanse')
    try {
      await cleanse(tokenId, traitIndex)
      // Don't clear loading state here - let useEffect handle it after confirmation
    } catch (error) {
      console.error('Failed to cleanse trait:', error)
      setActionLoading(null)
    }
  }

  const handleForge = async () => {
    if (!userTokens) {
      alert('Unable to fetch user tokens for forging')
      return
    }

    const otherTokenIds = userTokens.filter(id => Number(id) !== tokenId)
    
    if (otherTokenIds.length === 0) {
      alert('You need at least 2 evolved NFTs to forge. Create another evolved NFT first!')
      return
    }

    const secondTokenId = Number(otherTokenIds[0])
    
    if (confirm(`Forge NFT #${tokenId} with NFT #${secondTokenId}? Both NFTs will be burned and replaced with a new higher-generation NFT.`)) {
      setActionLoading('forge')
      try {
        await forge(tokenId, secondTokenId)
        // Don't clear loading state here - let useEffect handle it after confirmation
      } catch (error) {
        console.error('Failed to forge NFTs:', error)
        setActionLoading(null)
      }
    }
  }

  return (
    <div className="group w-full max-w-sm h-[600px] perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE */}
        <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border-2 border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Aetherium Shard #{tokenId}
                </span>
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs font-semibold px-3 py-1 rounded-full border-2 transition-all duration-300 ${
                  generation === 'Gen-1' 
                    ? 'border-cyan-400/50 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20' 
                    : generation === 'Gen-2'
                    ? 'border-purple-400/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20'
                    : 'border-yellow-400/50 text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20'
                }`}
              >
                {generation}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center space-y-6">
            <div className="relative group/nft w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur-md opacity-0 group-hover/nft:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center justify-center h-64 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-600/30 overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="text-8xl animate-pulse">{element.icon}</div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className={`text-lg font-bold text-center px-4 py-2 rounded-full border ${element.color} bg-opacity-20 border-opacity-50 backdrop-blur-sm`}>
                        {element.name}
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-6 left-6 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                      <div className="absolute top-12 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-8 left-12 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      <div className="absolute bottom-6 right-6 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="text-xs text-yellow-300/70 font-medium uppercase tracking-wide">Energy</div>
                <div className="text-2xl font-bold text-yellow-300 mt-1">{Number(attributes.energyLevel)}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="text-xs text-blue-300/70 font-medium uppercase tracking-wide">Purity</div>
                <div className="text-2xl font-bold text-blue-300 mt-1">{Number(attributes.purity)}%</div>
              </div>
            </div>

            <div className="text-center text-slate-400 text-sm animate-pulse">
              <div className="flex items-center justify-center space-x-2">
                <span>🔄</span>
                <span>Click to flip for details</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BACK SIDE */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900/95 via-slate-800/85 to-slate-900/95 border-2 border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                #{tokenId} Details
              </span>
              <div className="text-xs text-slate-400">🔄 Click to flip back</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="text-xs text-yellow-300/70 font-medium uppercase tracking-wide">Energy</div>
                <div className="flex items-center space-x-1 mt-1">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-300">{Number(attributes.energyLevel)}</span>
                </div>
              </div>
              
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="text-xs text-blue-300/70 font-medium uppercase tracking-wide">Purity</div>
                <div className="flex items-center space-x-1 mt-1">
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  <span className="text-sm font-bold text-blue-300">{Number(attributes.purity)}%</span>
                </div>
              </div>
              
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="text-xs text-purple-300/70 font-medium uppercase tracking-wide">Streak</div>
                <div className="text-sm font-bold text-purple-300 mt-1">{Number(attributes.currentStreak)}</div>
              </div>
              
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-300/70 font-medium uppercase tracking-wide">Status</div>
                <Badge 
                  variant={attributes.evolved ? "default" : "secondary"} 
                  className={`mt-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    attributes.evolved 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                      : 'bg-slate-500/20 text-slate-300 border-slate-500/50'
                  }`}
                >
                  {attributes.evolved ? 'Evolved' : 'Basic'}
                </Badge>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-600/30 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-3 w-3 text-purple-400" />
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Evolution Requirements</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-1 rounded bg-slate-700/30 border border-slate-600/20">
                  <span className="text-xs text-slate-300">Energy: {Number(attributes.energyLevel)}/100</span>
                  <span className={`text-xs font-bold ${Number(attributes.energyLevel) >= 100 ? "text-emerald-400" : "text-red-400"}`}>
                    {Number(attributes.energyLevel) >= 100 ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-700/30 border border-slate-600/20">
                  <span className="text-xs text-slate-300">Purity: {Number(attributes.purity)}% (≥80%)</span>
                  <span className={`text-xs font-bold ${Number(attributes.purity) >= 80 ? "text-emerald-400" : "text-red-400"}`}>
                    {Number(attributes.purity) >= 80 ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-slate-700/30 border border-slate-600/20">
                  <span className="text-xs text-slate-300">Not Evolved</span>
                  <span className={`text-xs font-bold ${!attributes.evolved ? "text-emerald-400" : "text-red-400"}`}>
                    {!attributes.evolved ? "✓" : "✗"}
                  </span>
                </div>
                <div className={`p-2 rounded-lg text-center font-bold text-xs border-2 transition-all duration-300 ${
                  canEvolve() 
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 animate-pulse" 
                    : "bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
                }`}>
                  Can Evolve: {canEvolve() ? "YES" : "NO"}
                </div>
              </div>
            </div>

            {attributes.infusedTraits.length > 0 && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-700/20 border border-slate-600/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                    <div className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Infused Traits</div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {attributes.infusedTraits.length}/∞
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {attributes.infusedTraits.map((trait: string, index: number) => {
                    const traitInfo = getTraitRarity(trait)
                    return (
                      <div 
                        key={index}
                        className={`relative p-2 rounded-lg bg-gradient-to-r ${traitInfo.bgColor} border ${traitInfo.borderColor} ${traitInfo.glowColor} transition-all duration-300 hover:scale-105 group`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{traitInfo.emoji}</span>
                            <span className={`text-xs font-bold ${traitInfo.textColor}`}>
                              {trait}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className={`text-xs font-medium ${traitInfo.textColor} opacity-70`}>
                              {traitInfo.rarity}
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {canEnergize() ? (
                <Button
                  onClick={handleEnergize}
                  disabled={isLoading || actionLoading === 'energize'}
                  className="w-full h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-600 border-0 text-white font-bold text-xs shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  {actionLoading === 'energize' ? 
                    (isConfirmed ? 'Updating...' : isConfirming ? 'Confirming...' : 'Energizing...') : 
                    `⚡ Energize (+${getEnergyGain()} Energy)`
                  }
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full h-10 bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed text-slate-300 font-medium border border-slate-500/50"
                >
                  <Zap className="h-4 w-4 mr-2 opacity-50" />
                  🕒 Cooldown: {getEnergizeCooldown()}
                </Button>
              )}
              
              {canEvolve() && (
                <Button
                  onClick={handleEvolve}
                  disabled={isLoading || actionLoading === 'evolve'}
                  className="w-full h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 border-0 text-white font-bold text-xs shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  {actionLoading === 'evolve' ? 
                    (isConfirmed ? 'Updating...' : isConfirming ? 'Confirming...' : 'Evolving...') : 
                    '✨ Evolve'
                  }
                </Button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleInfuse()}
                  disabled={isLoading || actionLoading === 'infuse'}
                  className="h-8 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/90 hover:to-blue-600/90 border border-cyan-400/30 text-white font-semibold text-xs shadow-md hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  <span className="mr-1">🧪</span>
                  {actionLoading === 'infuse' ? 
                    (isConfirmed ? 'Updating...' : isConfirming ? 'Confirming...' : 'Infusing...') : 
                    'Infuse (Demo)'
                  }
                </Button>

                {attributes.infusedTraits.length > 0 ? (
                  <Button
                    onClick={() => handleCleanse(0)}
                    disabled={isLoading || actionLoading === 'cleanse'}
                    className="h-8 bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90 border border-green-400/30 text-white font-semibold text-xs shadow-md hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    <span className="mr-1">🧽</span>
                    {actionLoading === 'cleanse' ? 
                      (isConfirmed ? 'Updating...' : isConfirming ? 'Confirming...' : 'Cleansing...') : 
                      'Cleanse'
                    }
                  </Button>
                ) : (
                  <div className="h-8 bg-slate-700/50 border border-slate-600/30 rounded-md flex items-center justify-center">
                    <span className="text-xs text-slate-400">No Traits</span>
                  </div>
                )}

                {attributes.evolved && (
                  <Button
                    onClick={() => handleForge()}
                    disabled={isLoading || actionLoading === 'forge'}
                    className="h-8 col-span-2 bg-gradient-to-r from-red-500/80 via-orange-500/80 to-red-500/80 hover:from-red-600/90 hover:via-orange-600/90 hover:to-red-600/90 border border-red-400/30 text-white font-bold text-xs shadow-md hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    <span className="mr-2">⚒️</span>
                    {actionLoading === 'forge' ? 
                      (isConfirmed ? 'Updating...' : isConfirming ? 'Confirming...' : 'Forging...') : 
                      'Forge (Need 2 Evolved NFTs)'
                    }
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function NFTGallery() {
  const { userTokens, balance, mint, isLoading, mintPrice, tokensLoading, refetchUserTokens, isConnected } = useChronoForge()
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = async () => {
    setIsMinting(true)
    try {
      await mint()
      setTimeout(() => {
        setIsMinting(false)
        refetchUserTokens()
      }, 3000)
    } catch (error) {
      console.error('Failed to mint NFT:', error)
      setIsMinting(false)
    }
  }

  if (!isConnected) {
    const hasTokens = userTokens && userTokens.length > 0
    
    if (!hasTokens) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-slate-900/80 border-slate-700">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-slate-400 mb-6">Connect your wallet to start minting and managing your Aetherium Shards</p>
              <WalletConnect />
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Chrono-Forge Aetherium
          </h1>
          <p className="text-slate-400 mb-4">
            Dynamic NFTs that evolve through daily interactions
          </p>
          <p className="text-lg text-slate-300">
            Balance: {balance ? `${Number(balance).toFixed(4)} AVAX` : '0.0000 AVAX'}
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <Card className="bg-slate-900/50 border-slate-700 max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Mint New Aetherium Shard</h3>
              <p className="text-slate-400 mb-4">
                Create a new dynamic NFT for {mintPrice ? `${Number(mintPrice).toFixed(3)} AVAX` : '0.001 AVAX'}
              </p>
              <Button
                onClick={handleMint}
                disabled={isLoading || isMinting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
              >
                {isMinting ? 'Minting...' : 'Mint NFT'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {tokensLoading ? (
          <div className="text-center py-12">
            <div className="text-slate-400">Loading your NFTs...</div>
          </div>
        ) : userTokens && userTokens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userTokens.map((tokenId) => (
              <NFTCard key={Number(tokenId)} tokenId={Number(tokenId)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Yet</h3>
            <p className="text-slate-400 mb-6">
              Mint your first Aetherium Shard to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NFTGallery
