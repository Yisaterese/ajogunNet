// "use client"
//
// import { useEffect, useState } from "react"
// import { ConnectButton, useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit"
// import { formatAddress } from "@mysten/sui.js/utils"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Wallet, AlertTriangle } from "lucide-react"
// import { formatSuiAmount } from "@/lib/sui-config"
//
// export function WalletConnection() {
//   const currentAccount = useCurrentAccount()
//   const [mounted, setMounted] = useState(false)
//
//   useEffect(() => {
//     setMounted(true)
//   }, [])
//
//   const {
//     data: balance,
//     error: balanceError,
//     isLoading,
//   } = useSuiClientQuery(
//     "getBalance",
//     {
//       owner: currentAccount?.address || "",
//     },
//     {
//       enabled: !!currentAccount && mounted,
//       retry: 3,
//       retryDelay: 1000,
//     },
//   )
//
//   if (!mounted) {
//     return (
//       <div className="flex flex-col gap-2">
//         <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
//         <p className="text-xs text-muted-foreground text-center">Loading...</p>
//       </div>
//     )
//   }
//
//   if (!currentAccount) {
//     return (
//       <div className="flex flex-col gap-2">
//         <div className="sui-wallet-kit">
//           <ConnectButton className="connect-button" />
//         </div>
//       </div>
//     )
//   }
//
//   const suiBalance = balance ? Number.parseFloat(balance.totalBalance) / 1_000_000_000 : 0
//
//   return (
//     <div className="space-y-2">
//       <Card className="w-full md:w-auto">
//         <CardContent className="p-3">
//           <div className="flex items-center space-x-3">
//             <div className="flex items-center space-x-2">
//               <Wallet className="h-4 w-4 text-primary" />
//               <span className="text-sm font-medium account-address">{formatAddress(currentAccount.address)}</span>
//             </div>
//             <Badge variant="secondary" className="text-xs account-balance">
//               {isLoading ? (
//                 <div className="loading-spinner h-3 w-3" />
//               ) : balanceError ? (
//                 "Error"
//               ) : (
//                 `${formatSuiAmount(suiBalance)} SUI`
//               )}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>
//
//       {balanceError && (
//         <Alert variant="destructive" className="text-xs">
//           <AlertTriangle className="h-3 w-3" />
//           <AlertDescription className="error-message">Failed to load balance</AlertDescription>
//         </Alert>
//       )}
//
//       {suiBalance < 0.01 && !isLoading && !balanceError && (
//         <Alert className="text-xs">
//           <AlertTriangle className="h-3 w-3" />
//           <AlertDescription className="warning-message">
//             Low SUI balance. You may need more SUI for transactions.
//           </AlertDescription>
//         </Alert>
//       )}
//     </div>
//   )
// }

'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { formatAddress } from '@mysten/sui.js/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, AlertTriangle } from 'lucide-react';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useToast } from '@/hooks/use-toast';
import { formatSuiAmount } from '@/lib/sui-config';
import {ConnectButton} from "@suiet/wallet-kit";

export function WalletConnection() {
    const { address, connected, connecting } = useWallet();
    const [mounted, setMounted] = useState(false);
    const { toast } = useToast();
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize SuiClient for Testnet
    const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let mounted = true;

        const fetchBalance = async () => {
            if (!mounted || !address || !connected) return;

            setIsLoading(true);
            setError(null);

            try {
                const balanceResponse = await suiClient.getBalance({
                    owner: address,
                });
                if (mounted) {
                    setBalance(Number.parseFloat(balanceResponse.totalBalance) / 1_000_000_000);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load balance');
                    toast({
                        title: 'Balance Fetch Error',
                        description: err instanceof Error ? err.message : 'Failed to load balance',
                        variant: 'destructive',
                    });
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchBalance();

        return () => {
            mounted = false;
        };
    }, [address, connected, toast]);

    if (!mounted || connecting) {
        return (
            <div className="flex flex-col gap-2">
                <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
                {/*<p className="text-xs text-muted-foreground text-center">Loading...</p>*/}
            </div>
        );
    }

    if (!connected) {
        return (
            <div className="flex flex-col gap-2">
                <div className="sui-wallet-kit">
                    <ConnectButton connectText="Connect Sui Wallet" />
                </div>
            </div>
        );
    }

    const suiBalance = balance !== null ? balance : 0;

    return (
        <div className="space-y-2">
            <Card className="w-full md:w-auto">
                <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <Wallet className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium account-address">{formatAddress(address)}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs account-balance">
                            {isLoading ? (
                                <div className="loading-spinner h-3 w-3 border-2 border-primary rounded-full" />
                            ) : error ? (
                                'Error'
                            ) : (
                                `${formatSuiAmount(suiBalance)} SUI`
                            )}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
            {error && !isLoading && (
                <Alert variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="error-message">{error}</AlertDescription>
                </Alert>
            )}
            {/*{suiBalance < 0.01 && !isLoading && !error && (*/}
            {/*    <Alert className="text-xs">*/}
            {/*        <AlertTriangle className="h-3 w-3" />*/}
            {/*        <AlertDescription className="warning-message">*/}
            {/*            Low SUI balance. Get more SUI for transactions on{' '}*/}
            {/*            <a href="https://faucet.testnet.sui.io" target="_blank" rel="noopener noreferrer" className="underline">*/}
            {/*                Testnet Faucet*/}
            {/*            </a>.*/}
            {/*        </AlertDescription>*/}
            {/*    </Alert>*/}
            {/*)}*/}
        </div>
    );
}