// "use client"
//
// import { useState, useEffect } from "react"
// import { useCurrentAccount, useSignAndExecuteTransaction, ConnectButton } from "@mysten/dapp-kit"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { useWillOperations, type WillData } from "@/lib/sui-client"
// import { SUI_CONFIG, isValidPackageId, formatSuiAmount } from "@/lib/sui-config"
// import { Trash2, AlertCircle, RefreshCw, AlertTriangle } from "lucide-react"
// import Link from "next/link"
//
// export default function DashboardPage() {
//   const [wills, setWills] = useState<WillData[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [revokingWill, setRevokingWill] = useState<string | null>(null)
//   const [refreshing, setRefreshing] = useState(false)
//
//   const currentAccount = useCurrentAccount()
//   const { mutate: signAndExecute } = useSignAndExecuteTransaction()
//   const { toast } = useToast()
//   const { queryUserWills, revokeWillTransaction } = useWillOperations()
//
//   useEffect(() => {
//     if (currentAccount) {
//       fetchWills()
//     }
//   }, [currentAccount])
//
//   const fetchWills = async () => {
//     if (!currentAccount) return
//
//     setIsLoading(true)
//     try {
//       const userWills = await queryUserWills()
//       setWills(userWills)
//     } catch (error) {
//       console.error("Error fetching wills:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch wills. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }
//
//   const refreshWills = async () => {
//     setRefreshing(true)
//     await fetchWills()
//     setRefreshing(false)
//     toast({
//       title: "Refreshed",
//       description: "Will data has been updated.",
//     })
//   }
//
//   const revokeWill = async (willId: string) => {
//     if (!currentAccount) return
//
//     // Check if contract is deployed
//     if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
//       toast({
//         title: "Contract Not Deployed",
//         description: "Cannot revoke will: Smart contract is not deployed.",
//         variant: "destructive",
//       })
//       return
//     }
//
//     setRevokingWill(willId)
//     try {
//       const tx = revokeWillTransaction(willId)
//
//       signAndExecute(
//         {
//           transaction: tx,
//           options: {
//             showInput: true,
//             showEffects: true,
//             showEvents: true,
//           },
//         },
//         {
//           onSuccess: (result) => {
//             toast({
//               title: "Will Revoked Successfully!",
//               description: `Transaction: ${result.digest.slice(0, 20)}...`,
//             })
//             fetchWills() // Refresh the list
//           },
//           onError: (error) => {
//             console.error("Revoke error:", error)
//             toast({
//               title: "Failed to Revoke Will",
//               description: error.message || "An unexpected error occurred",
//               variant: "destructive",
//             })
//           },
//         },
//       )
//     } catch (error) {
//       console.error("Revoke will error:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to revoke will. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setRevokingWill(null)
//     }
//   }
//
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//       case "Executed":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
//       case "Revoked":
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }
//
//   if (!currentAccount) {
//     return (
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">Digital Wills Dashboard</h1>
//             <p className="text-muted-foreground">Manage and monitor your digital wills</p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" disabled>
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </Button>
//             <Button asChild>
//               <Link href="/create">Create New Will</Link>
//             </Button>
//           </div>
//         </div>
//
//         <Alert>
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             <div className="space-y-2">
//               <p>Connect your Sui wallet to view and manage your digital wills.</p>
//               <div className="sui-wallet-kit">
//                 <ConnectButton />
//               </div>
//             </div>
//           </AlertDescription>
//         </Alert>
//       </div>
//     )
//   }
//
//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Your Digital Wills</h1>
//           <p className="text-muted-foreground">Manage and monitor your digital wills</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={refreshWills} disabled={refreshing} size="sm">
//             <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
//           <Button asChild>
//             <Link href="/create">Create New Will</Link>
//           </Button>
//         </div>
//       </div>
//
//       {/* Contract Status Warning */}
//       {!isValidPackageId(SUI_CONFIG.PACKAGE_ID) && (
//         <Alert>
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             Smart contract not deployed. Please configure NEXT_PUBLIC_PACKAGE_ID environment variable.
//           </AlertDescription>
//         </Alert>
//       )}
//
//       {isLoading ? (
//         <div className="grid gap-4">
//           {[1, 2, 3].map((i) => (
//             <Card key={i}>
//               <CardContent className="p-6">
//                 <div className="animate-pulse space-y-4">
//                   <div className="h-4 bg-muted rounded w-1/4"></div>
//                   <div className="h-4 bg-muted rounded w-1/2"></div>
//                   <div className="h-4 bg-muted rounded w-1/3"></div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : wills.length === 0 ? (
//         <Card>
//           <CardContent className="p-12 text-center space-y-4">
//             <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
//             <h3 className="text-xl font-semibold">No Wills Found</h3>
//             <p className="text-muted-foreground">
//               You haven't created any digital wills yet. Create your first will to secure your digital assets.
//             </p>
//             <Button asChild>
//               <Link href="/create">Create Your First Will</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {wills.map((will) => (
//             <Card key={will.id}>
//               <CardHeader>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                   <div>
//                     <CardTitle className="text-lg">Will #{will.id.slice(0, 8)}...</CardTitle>
//                     <CardDescription>Created on {will.createdAt}</CardDescription>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge className={getStatusColor(will.status)}>{will.status}</Badge>
//                     {will.autoSend && <Badge variant="outline">Auto-Send</Badge>}
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">SUI Amount</p>
//                     <p className="text-lg font-semibold">{formatSuiAmount(will.suiAmount)} SUI</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Heirs</p>
//                     <p className="text-lg font-semibold">{will.heirs.length}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Status</p>
//                     <p className="text-lg font-semibold">{will.status}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">Auto-Send</p>
//                     <p className="text-lg font-semibold">{will.autoSend ? "Yes" : "No"}</p>
//                   </div>
//                 </div>
//
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium text-muted-foreground">Heir Distribution</p>
//                   <div className="space-y-1">
//                     {will.heirs.map((heir, index) => (
//                       <div key={index} className="flex justify-between items-center text-sm">
//                         <span className="font-mono">
//                           {heir.address.slice(0, 8)}...{heir.address.slice(-6)}
//                         </span>
//                         <span className="font-medium">{heir.percentage}%</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//
//                 {will.lastActivity && (
//                   <div className="text-sm text-muted-foreground">Last activity: {will.lastActivity}</div>
//                 )}
//
//                 {will.status === "Active" && (
//                   <div className="flex gap-2 pt-4 border-t">
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => revokeWill(will.id)}
//                       disabled={revokingWill === will.id || !isValidPackageId(SUI_CONFIG.PACKAGE_ID)}
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       {revokingWill === will.id ? "Revoking..." : "Revoke Will"}
//                     </Button>
//                     {!isValidPackageId(SUI_CONFIG.PACKAGE_ID) && (
//                       <p className="text-sm text-muted-foreground self-center">(Contract not deployed)</p>
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Trash2, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { isValidPackageId, SUI_CONFIG } from '@/lib/sui-config';
import { getAllWills, revokeWill } from '@/lib/willon-sui';
import { ConnectButton } from '@suiet/wallet-kit';

interface WillView {
  index: number;
  heirs: string[];
  shares: number[];
  executed: boolean;
}

export default function DashboardPage() {
  const { address, connected } = useWallet();
  const [wills, setWills] = useState<WillView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingWill, setRevokingWill] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (connected && address) {
      fetchWills();
    }
  }, [connected, address]);

  const fetchWills = async () => {
    setIsLoading(true);
    try {
      const data = await getAllWills(useWallet());
      setWills(data);
    } catch (error) {
      console.error('Error fetching wills:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch wills. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWills = async () => {
    setRefreshing(true);
    await fetchWills();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Will data has been updated.',
    });
  };

  const revokeWillHandler = async (index: number) => {
    if (!connected || !address) return;

    setRevokingWill(index);
    try {
      await revokeWill(useWallet(), index);
      toast({ title: 'Will Revoked Successfully!', description: 'Will has been revoked.' });
      fetchWills();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to revoke will.',
        variant: 'destructive',
      });
    } finally {
      setRevokingWill(null);
    }
  };

  const getStatusColor = (executed: boolean) => {
    return executed
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  if (!connected) {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Digital Wills Dashboard</h1>
              <p className="text-muted-foreground">Manage and monitor your digital wills</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button asChild>
                <Link href="/create">Create New Will</Link>
              </Button>
            </div>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Connect your Sui wallet to view and manage your digital wills.</p>
                <div className="sui-wallet-kit">
                  <ConnectButton connectText="Connect Wallet" />
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Digital Wills</h1>
            <p className="text-muted-foreground">Manage and monitor your digital wills</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshWills} disabled={refreshing} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/create">Create New Will</Link>
            </Button>
          </div>
        </div>

        {!isValidPackageId(SUI_CONFIG.PACKAGE_ID) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Smart contract not deployed. Please configure NEXT_PUBLIC_PACKAGE_ID environment variable.
              </AlertDescription>
            </Alert>
        )}

        {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        ) : wills.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold">No Wills Found</h3>
                <p className="text-muted-foreground">
                  You haven't created any digital wills yet. Create your first will to secure your digital assets.
                </p>
                <Button asChild>
                  <Link href="/create">Create Your First Will</Link>
                </Button>
              </CardContent>
            </Card>
        ) : (
            <div className="space-y-4">
              {wills.map((will) => (
                  <Card key={will.index}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <CardTitle className="text-lg">Will #{will.index}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(will.executed)}>
                          {will.executed ? 'Executed' : 'Active'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Heirs</p>
                          <p className="text-lg font-semibold">{will.heirs.length}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                          <p className="text-lg font-semibold">{will.shares.reduce((a, b) => a + b, 0) / 100}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Heir Distribution</p>
                        <div className="space-y-1">
                          {will.heirs.map((heir, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="font-mono">{heir.slice(0, 8)}...{heir.slice(-6)}</span>
                                <span className="font-medium">{will.shares[index]}%</span>
                              </div>
                          ))}
                        </div>
                      </div>
                      {!will.executed && (
                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => revokeWillHandler(will.index)}
                                disabled={revokingWill === will.index || !isValidPackageId(SUI_CONFIG.PACKAGE_ID)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {revokingWill === will.index ? 'Revoking...' : 'Revoke Will'}
                            </Button>
                            {!isValidPackageId(SUI_CONFIG.PACKAGE_ID) && (
                                <p className="text-sm text-muted-foreground self-center">(Contract not deployed)</p>
                            )}
                          </div>
                      )}
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
}