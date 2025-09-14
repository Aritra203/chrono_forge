#  **Chrono Forge**: Dynamic NFT Evolution Platform. 
This project runs exclusively on Avalanche Fuji testnet - no real AVAX required!

Chrono-Forge is a cutting-edge NFT platform featuring dynamic on-chain SVG generation and evolving attributes. Built with Next.js, Hardhat, and modern Web3 tools.

❄️ **Avalanche Fuji Only**: This project runs exclusively on Avalanche Fuji testnet - no real ETH required!

## ✨ Features

- **Dynamic NFT Evolution**: Watch your Aetherium Shards transform through interactions
- **On-Chain SVG Generation**: Fully on-chain artwork that changes with your NFT's state
- **Daily Energize System**: Build power through daily interactions and streak bonuses
- **Trait Infusion**: Burn partner tokens to grant unique abilities
- **Generational Forging**: Combine evolved NFTs for rare next-generation specimens
- **Purity System**: Cleanse unwanted traits to improve your NFT's core attributes

## ❄️ Avalanche Fuji Testnet

- **Lightning Fast**: Sub-second finality with very low fees
- **Free AVAX**: Get tokens from multiple reliable faucets
- **Highly Reliable**: Well-supported testnet environment
- **EVM Compatible**: Same Solidity contracts work perfectly

All testnet tokens are free via faucets. See our [Avalanche Setup Guide](./TESTNET_GUIDE.md) for instructions.ono-Forge 🔥✨

> **Dynamic NFTs that evolve through on-chain interactions**

Chrono-Forge is a revolutionary NFT project featuring dynamic on-chain SVG generation, evolving attributes, and multi-generational forging mechanics. Built on Base blockchain with a modern Next.js frontend.

## 🌟 Features

### Core NFT Mechanics
- **Dynamic On-Chain SVG**: NFT artwork generated directly by smart contract
- **Evolvable Attributes**: Energy Level, Purity, Core Element, Generation, and Infused Traits
- **ERC721 Compliance**: Full compatibility with wallets and marketplaces
- **Real-time Updates**: UI automatically reflects on-chain changes

### User Actions
- 🔥 **Mint**: Acquire your first Aetherium Shard
- ⚡ **Energize**: Daily action to increase Energy Level with streak bonuses
- 🧬 **Infuse**: Burn partner tokens to grant unique traits
- 🦋 **Evolve**: Transform NFT into advanced forms
- 🔨 **Forge**: Combine two evolved NFTs for next-generation specimens
- 🌊 **Cleanse**: Remove unwanted traits to improve Purity

## 🛠 Tech Stack

### Smart Contracts
- **Solidity** - Industry standard for EVM chains
- **Hardhat** - Development framework
- **OpenZeppelin** - Secure, audited contract libraries
- **Base Blockchain** - Layer 2 Ethereum scaling solution

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Wagmi & Viem** - Web3 wallet integration
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- MetaMask or compatible Web3 wallet

### 1. Clone and Install
```bash
git clone https://github.com/your-username/chrono-forge.git
cd chrono-forge
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

⚠️ **Important**: Update `NEXT_PUBLIC_CONTRACT_ADDRESS` with your deployed contract address

### 3. Get Free AVAX Tokens:**
- Visit: https://faucet.avax.network/
- Request free AVAX tokens for Avalanche Fuji testnet

### 4. Deploy to Avalanche:**
```bash
# Deploy to Avalanche Fuji
npx hardhat run scripts/deploy.ts --network avalancheFuji

### 5. Update Contract Address:**
```bash
# Update .env.local with the deployed contract address
```

### 6. Run Development Server:**
```bash
npm run dev
```

Visit `http://localhost:3000` and connect your wallet to start minting!
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🔧 Troubleshooting

### WebSocket/Transport Errors
If you see console errors like "Fatal socket error received, closing transport":
- These are WalletConnect WebSocket connection issues
- The app has built-in error handling to prevent crashes
- Functionality remains intact - you can still use injected wallets (MetaMask)
- To resolve: Get a proper WalletConnect Project ID from [cloud.reown.com](https://cloud.reown.com)

### Missing WalletConnect Project ID
- WalletConnect will be disabled but other wallets work fine
- Update `.env.local` with your project ID to enable WalletConnect

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
