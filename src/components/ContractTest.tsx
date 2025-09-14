'use client'

import { useReadContract } from 'wagmi'
import { avalancheFuji } from 'wagmi/chains'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CHRONO_FORGE_ADDRESS as `0x${string}`

const MINIMAL_ABI = [
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

export default function ContractTest() {
  const { data: basicStats, error, isLoading, isSuccess } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MINIMAL_ABI,
    functionName: 'getBasicStats',
    chainId: avalancheFuji.id,
  })

  console.log('ContractTest Debug:', {
    CONTRACT_ADDRESS,
    basicStats,
    error,
    isLoading,
    isSuccess,
    chainId: avalancheFuji.id
  })

  return (
    <div className="mt-8 p-6 bg-slate-800 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Contract Test</h3>
      <div className="space-y-2 text-sm">
        <p className="text-slate-300">Contract: <span className="text-blue-400 font-mono">{CONTRACT_ADDRESS}</span></p>
        <p className="text-slate-300">Chain: <span className="text-green-400">Avalanche Fuji ({avalancheFuji.id})</span></p>
        <p className="text-slate-300">Loading: <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>{isLoading ? 'Yes' : 'No'}</span></p>
        <p className="text-slate-300">Success: <span className={isSuccess ? 'text-green-400' : 'text-gray-400'}>{isSuccess ? 'Yes' : 'No'}</span></p>
        
        {error && (
          <p className="text-red-400">Error: {error.message}</p>
        )}
        
        {basicStats && (
          <div className="mt-4 p-4 bg-slate-700 rounded">
            <p className="text-green-400 font-semibold">✅ Contract Data Found!</p>
            <p className="text-white">Total Minted: <span className="text-purple-400 font-bold">{Number(basicStats[0])}</span></p>
            <p className="text-white">Total Evolved: <span className="text-purple-400 font-bold">{Number(basicStats[1])}</span></p>
          </div>
        )}
        
        {!basicStats && !isLoading && !error && (
          <p className="text-yellow-400">No data returned (but no error)</p>
        )}
      </div>
    </div>
  )
}