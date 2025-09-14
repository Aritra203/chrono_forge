'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Coins, Network, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const testnets = [
  {
    name: 'Avalanche Fuji',
    chainId: '43113',
    currency: 'AVAX',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorer: 'https://testnet.snowtrace.io',
    faucets: [
      { name: 'Avalanche Faucet', url: 'https://faucet.avax.network/' },
      { name: 'Chainlink Faucet', url: 'https://faucets.chain.link/fuji' }
    ],
    recommended: true
  }
];

export default function TestnetGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Avalanche Fuji Setup Guide</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Get free AVAX tokens to interact with Chrono-Forge on Avalanche Fuji testnet. 
            No real money required - everything runs on free testnet tokens!
          </p>
        </div>

        {/* Quick Start Steps */}
        <Card className="mb-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Coins className="h-5 w-5 mr-2 text-green-400" />
              Quick Start Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <ol className="list-decimal list-inside space-y-2">
              <li>Add Avalanche Fuji network to your MetaMask wallet</li>
              <li>Visit the faucet links below to get free AVAX tokens</li>
              <li>Return to Chrono-Forge and connect your wallet</li>
              <li>Start minting and evolving your NFTs for free!</li>
            </ol>
          </CardContent>
        </Card>

        {/* Testnet Card */}
        <div className="grid gap-6">
          {testnets.map((testnet) => (
            <Card key={testnet.chainId} className={`bg-slate-800 border-slate-700 ${testnet.recommended ? 'ring-2 ring-green-400' : ''}`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Network className="h-5 w-5 mr-2 text-blue-400" />
                    {testnet.name}
                  </span>
                  {testnet.recommended && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Recommended</span>
                  )}
                </CardTitle>
                <CardDescription>Chain ID: {testnet.chainId} • Currency: {testnet.currency}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Network Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">RPC URL:</span>
                    <code className="text-xs bg-slate-700 px-1 rounded text-slate-300">{testnet.rpc}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Explorer:</span>
                    <a
                      href={testnet.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-xs flex items-center"
                    >
                      View Explorer <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Faucets */}
                <div>
                  <h4 className="text-white font-semibold mb-2">Free Token Faucets:</h4>
                  <div className="space-y-2">
                    {testnet.faucets.map((faucet, index) => (
                      <a
                        key={index}
                        href={faucet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                        >
                          {faucet.name} <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Add Network Button */}
                <Button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.ethereum) {
                      window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                          chainId: `0x${parseInt(testnet.chainId).toString(16)}`,
                          chainName: testnet.name,
                          nativeCurrency: {
                            name: testnet.currency,
                            symbol: testnet.currency,
                            decimals: 18
                          },
                          rpcUrls: [testnet.rpc],
                          blockExplorerUrls: [testnet.explorer]
                        }]
                      });
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Add {testnet.name} to MetaMask
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card className="mt-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              <strong>New to testnets?</strong> Testnets are separate blockchain networks used for testing. 
              The tokens have no real value, making them perfect for experimenting with dApps like Chrono-Forge.
            </p>
            <div className="space-y-2">
              <p><strong>Common Issues:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>If faucets are empty, try a different one or wait 24 hours</li>
                <li>Some faucets require social media verification</li>
                <li>Make sure your wallet is connected to the correct network</li>
                <li>Check that you have enough gas for transactions (usually very small amounts)</li>
              </ul>
            </div>
            <p className="text-green-400">
              💡 <strong>Pro Tip:</strong> Avalanche Fuji is recommended as it&apos;s lightning-fast, reliable, and has excellent faucet availability!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
