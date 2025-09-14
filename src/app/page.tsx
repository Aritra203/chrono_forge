import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, GitBranch, Flame } from "lucide-react";
import Link from "next/link";
// import { EcosystemStats } from "@/components/EcosystemStats";
// import ContractTest from "@/components/ContractTest";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Chrono-Forge
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-purple-400 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-purple-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/testnet-guide" className="text-slate-300 hover:text-purple-400 transition-colors">
                Guide
              </Link>
              <a 
                href="https://github.com/Aritra203/chrono-forge" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                GitHub
              </a>
            </nav>

            {/* Wallet Connect */}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">
              Dynamic NFTs That
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Evolve With You
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the future of NFTs with Chrono-Forge. Your Aetherium Shards evolve through 
              daily interactions, trait infusion, and generational forging—all powered by on-chain dynamics.
              {/* <span className="block mt-4 text-lg text-green-400 font-semibold">
                ❄️ Now running exclusively on Avalanche Fuji - no real AVAX required!
              </span> */}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Mint Your First Shard
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <div className="text-center mb-8">
            {/* <p className="text-lg text-green-400 mb-2">
              ❄️ Running exclusively on Avalanche Fuji testnet
            </p> */}
            <p className="text-slate-300">
              Get free AVAX tokens from faucets - check our{" "}
              <a href="/testnet-guide" 
                 className="text-blue-400 hover:underline">
                Avalanche Setup Guide
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Daily Energize"
            description="Build your NFT's power through daily interactions and maintain streaks for bonus rewards."
          />
          <FeatureCard
            icon={<Sparkles className="h-8 w-8" />}
            title="Trait Infusion"
            description="Burn partner tokens to grant your NFT unique abilities and cosmetic features."
          />
          <FeatureCard
            icon={<GitBranch className="h-8 w-8" />}
            title="Evolution"
            description="Transform your NFT into more advanced forms when it reaches evolution criteria."
          />
          <FeatureCard
            icon={<Flame className="h-8 w-8" />}
            title="Generational Forging"
            description="Combine two evolved NFTs to create a rare next-generation specimen."
          />
        </div>

        {/* Stats Section */}
        {/* <EcosystemStats /> */}
        
        {/* Debug Section */}
        {/* <ContractTest /> */}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-gradient-to-b from-slate-950 to-slate-900 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Chrono-Forge
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dynamic NFTs that evolve through on-chain interactions. Experience the future of digital collectibles on Avalanche.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/Aritra203/chrono-forge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <GitBranch className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/chronoforge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <Sparkles className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-slate-400 hover:text-purple-400 transition-colors text-sm">
                  My Collection
                </Link>
                <Link href="/testnet-guide" className="block text-slate-400 hover:text-purple-400 transition-colors text-sm">
                  Avalanche Guide
                </Link>
                <a 
                  href="https://testnet.snowtrace.io/address/0xA06955c2930D66efb83Def15Fa704EFcd04a0E5a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-slate-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Contract Explorer
                </a>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Resources</h4>
              <div className="space-y-2">
                <a 
                  href="https://faucet.avax.network/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-slate-400 hover:text-purple-400 transition-colors text-sm"
                >
                  AVAX Faucet
                </a>
                <a 
                  href="https://core.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-slate-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Core Wallet
                </a>
                <a 
                  href="https://docs.avax.network/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-slate-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Avalanche Docs
                </a>
              </div>
            </div>

            {/* Network Info */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Network</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400">Avalanche Fuji</span>
                </div>
                <div className="text-slate-500">
                  Chain ID: 43113
                </div>
                <div className="text-slate-500 text-xs font-mono">
                  0xA06955c2930D66efb83Def15Fa704EFcd04a0E5a
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2025 Chrono-Forge. Building the future of dynamic NFTs.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span className="flex items-center space-x-1">
                <Flame className="h-4 w-4 text-orange-400" />
                <span>Powered by Avalanche</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>No Gas Fees</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-4 hover:border-purple-500 transition-colors">
      <div className="text-purple-400">{icon}</div>
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}


