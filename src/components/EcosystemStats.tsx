'use client'

import { useEcosystemStats } from '@/hooks/useChronoForge'
import { useEffect, useState } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  isLoading?: boolean
  gradient?: boolean
}

function StatCard({ title, value, isLoading, gradient = false }: StatCardProps) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={`text-5xl font-bold ${gradient ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' : 'text-white'}`}>
        {isLoading ? (
          <div className="animate-pulse bg-purple-400/20 rounded h-12 w-16"></div>
        ) : (
          <span className="tabular-nums">{value}</span>
        )}
      </div>
      <div className="text-slate-300 font-medium">{title}</div>
    </div>
  )
}

export function EcosystemStats() {
  const { data: stats, isLoading, error } = useEcosystemStats()
  const [animatedValues, setAnimatedValues] = useState({
    totalMinted: 0,
    activeHolders: 0,
    dailyEnergizers: 0,
    totalEvolved: 0
  })

  // Debug logging
  useEffect(() => {
    console.log('EcosystemStats Debug:', {
      stats,
      isLoading,
      error: error?.message || error,
      contractAddress: process.env.NEXT_PUBLIC_CHRONO_FORGE_ADDRESS
    })
  }, [stats, isLoading, error])

  // Animate numbers counting up
  useEffect(() => {
    if (stats && !isLoading) {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

        setAnimatedValues({
          totalMinted: Math.floor(stats.totalMinted * easeProgress),
          activeHolders: Math.floor(stats.activeHolders * easeProgress),
          dailyEnergizers: Math.floor(stats.dailyEnergizers * easeProgress),
          totalEvolved: Math.floor(stats.totalEvolved * easeProgress)
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setAnimatedValues({
            totalMinted: stats.totalMinted,
            activeHolders: stats.activeHolders,
            dailyEnergizers: stats.dailyEnergizers,
            totalEvolved: stats.totalEvolved
          })
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [stats, isLoading])

  if (error) {
    console.error('Failed to load ecosystem stats:', error)
  }

  // Show demo data if we can't load from contract
  const displayStats = stats || {
    totalMinted: 42,
    activeHolders: 38,
    dailyEnergizers: 15,
    totalEvolved: 8
  }

  const displayValues = stats ? animatedValues : displayStats

  return (
    <div className="mt-24 bg-gradient-to-br from-purple-950/50 to-slate-950/50 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-8">
      <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Ecosystem Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <StatCard 
          title="Total Minted" 
          value={isLoading ? 0 : displayValues.totalMinted} 
          isLoading={isLoading}
          gradient={true}
        />
        <StatCard 
          title="Active Holders" 
          value={isLoading ? 0 : displayValues.activeHolders} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Daily Energizers" 
          value={isLoading ? 0 : displayValues.dailyEnergizers} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Evolutions" 
          value={isLoading ? 0 : displayValues.totalEvolved} 
          isLoading={isLoading}
        />
      </div>
      <div className="mt-8 pt-6 border-t border-purple-800/30">
        <div className="flex justify-center items-center space-x-6 text-sm text-slate-400">
          <span>🔥 Average Energy Level: {stats?.averageEnergyLevel || 42}</span>
          <span>⚡ {stats ? 'Live on Avalanche Fuji' : 'Demo Data'}</span>
          <span>🔄 {error ? 'Connection Error' : 'Updated every 30s'}</span>
        </div>
        {error && (
          <div className="mt-4 text-center text-red-400 text-sm">
            Unable to fetch live data: {error.message || 'Contract connection failed'}
          </div>
        )}
      </div>
    </div>
  )
}