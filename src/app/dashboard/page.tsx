import { NFTGallery } from '@/components/nft/NFTCard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <NFTGallery />
      </div>
    </div>
  )
}
