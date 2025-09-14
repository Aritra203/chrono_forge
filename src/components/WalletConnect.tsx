'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to Chrono-Forge
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => {
                connect({ connector })
                setOpen(false)
              }}
              disabled={status === 'pending'}
            >
              <Wallet className="h-5 w-5" />
              {connector.name}
            </Button>
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-500 text-center">
            {error.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
