'use client';

import type React from 'react';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Network configuration with fallback
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      staleTime: 30000,
    },
  },
});

export function SuiProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side before initializing wallet providers
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Initializing AjogunNet...</p>
            </div>
          </div>
        </QueryClientProvider>
    );
  }

  return (
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider
              autoConnect={true}
                          enableUnsafeBurner={false}
                          stashedWallet={{
                            name: 'AjogunNet Wallet'
          }}>
            {children}
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
  );
}