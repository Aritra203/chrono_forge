import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { Web3ErrorBoundary } from "@/components/providers/Web3ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chrono-Forge | Dynamic NFT Evolution",
  description: "Experience the future of NFTs with dynamic on-chain evolution, trait infusion, and generational forging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        <Web3ErrorBoundary>
          <Web3Provider>
            {children}
          </Web3Provider>
        </Web3ErrorBoundary>
      </body>
    </html>
  );
}
