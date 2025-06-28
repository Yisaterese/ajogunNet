// "use client"
//
// import { useState, useEffect } from "react"
// import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery, ConnectButton } from "@mysten/dapp-kit"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { TooltipWrapper } from "@/components/tooltip-wrapper"
// import { useWillOperations } from "@/lib/sui-client"
// import { SUI_CONFIG, validateSuiAddress, validateHeirPercentages, isValidPackageId } from "@/lib/sui-config"
// import { ArrowLeft, ArrowRight, Plus, Trash2, AlertTriangle } from "lucide-react"
// import { useRouter } from "next/navigation"
//
// interface Heir {
//   address: string
//   percentage: number
// }
//
// export default function CreateWillPage() {
//   const [step, setStep] = useState(1)
//   const [suiAmount, setSuiAmount] = useState("")
//   const [heirs, setHeirs] = useState<Heir[]>([
//     { address: "", percentage: 50 },
//     { address: "", percentage: 50 },
//   ])
//   const [autoSend, setAutoSend] = useState(true)
//   const [isLoading, setIsLoading] = useState(false)
//   const [gasEstimate, setGasEstimate] = useState<number>(0.001)
//
//   const currentAccount = useCurrentAccount()
//   const { mutate: signAndExecute } = useSignAndExecuteTransaction()
//   const { toast } = useToast()
//   const router = useRouter()
//   const { createWillTransaction, estimateGasFee } = useWillOperations()
//
//   // Get user's SUI balance
//   const { data: balance } = useSuiClientQuery(
//     "getBalance",
//     {
//       owner: currentAccount?.address || "",
//     },
//     {
//       enabled: !!currentAccount,
//     },
//   )
//
//   // Update gas estimate when transaction parameters change
//   useEffect(() => {
//     if (validateStep1() && validateStep2()) {
//       updateGasEstimate()
//     }
//   }, [suiAmount, heirs, autoSend])
//
//   const updateGasEstimate = async () => {
//     try {
//       const validHeirs = heirs.filter((heir) => heir.address.trim() !== "")
//       const tx = createWillTransaction({
//         suiAmount: Number.parseFloat(suiAmount),
//         heirs: validHeirs,
//         autoSend,
//       })
//       const estimate = await estimateGasFee(tx)
//       setGasEstimate(estimate)
//     } catch (error) {
//       console.error("Error estimating gas:", error)
//       setGasEstimate(0.001) // Fallback
//     }
//   }
//
//   const validateStep1 = () => {
//     const amount = Number.parseFloat(suiAmount)
//     return amount >= SUI_CONFIG.MIN_SUI_AMOUNT && !isNaN(amount)
//   }
//
//   const validateStep2 = () => {
//     const validHeirs = heirs.filter((heir) => heir.address.trim() !== "")
//     const validAddresses = validHeirs.every((heir) => validateSuiAddress(heir.address))
//     const validPercentages = validateHeirPercentages(validHeirs)
//
//     return validHeirs.length > 0 && validHeirs.length <= SUI_CONFIG.MAX_HEIRS && validAddresses && validPercentages
//   }
//
//   const addHeir = () => {
//     if (heirs.length < SUI_CONFIG.MAX_HEIRS) {
//       setHeirs([...heirs, { address: "", percentage: 0 }])
//     }
//   }
//
//   const removeHeir = (index: number) => {
//     if (heirs.length > 1) {
//       setHeirs(heirs.filter((_, i) => i !== index))
//     }
//   }
//
//   const updateHeir = (index: number, field: keyof Heir, value: string | number) => {
//     const updatedHeirs = [...heirs]
//     updatedHeirs[index] = { ...updatedHeirs[index], [field]: value }
//     setHeirs(updatedHeirs)
//   }
//
//   const createWill = async () => {
//     if (!currentAccount || !validateStep1() || !validateStep2()) return
//
//     // Check if contract is deployed
//     if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
//       toast({
//         title: "Contract Not Deployed",
//         description: "The smart contract is not yet deployed. Please check back later or contact support.",
//         variant: "destructive",
//       })
//       return
//     }
//
//     setIsLoading(true)
//     try {
//       // Filter out empty heirs
//       const validHeirs = heirs.filter((heir) => heir.address.trim() !== "")
//
//       // Create transaction
//       const tx = createWillTransaction({
//         suiAmount: Number.parseFloat(suiAmount),
//         heirs: validHeirs,
//         autoSend,
//       })
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
//               title: "Will Created Successfully!",
//               description: `Transaction: ${result.digest.slice(0, 20)}...`,
//             })
//             router.push("/dashboard")
//           },
//           onError: (error) => {
//             console.error("Transaction error:", error)
//             toast({
//               title: "Failed to Create Will",
//               description: error.message || "An unexpected error occurred",
//               variant: "destructive",
//             })
//           },
//         },
//       )
//     } catch (error) {
//       console.error("Create will error:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to create will. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }
//
//   if (!currentAccount) {
//     return (
//       <div className="max-w-2xl mx-auto space-y-6">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold">Create Digital Will</h1>
//           <p className="text-muted-foreground">Secure your SUI tokens for your heirs</p>
//         </div>
//
//         <Alert>
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             <div className="space-y-2">
//               <p>Connect your Sui wallet to create your digital will.</p>
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
//   const userBalance = balance ? Number.parseFloat(balance.totalBalance) / 1_000_000_000 : 0
//   const totalRequired = Number.parseFloat(suiAmount || "0") + gasEstimate
//
//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold">Create Digital Will</h1>
//         <p className="text-muted-foreground">Secure your SUI tokens for your heirs</p>
//       </div>
//
//       {/* Contract Status Warning */}
//       {!isValidPackageId(SUI_CONFIG.PACKAGE_ID) && (
//         <Alert variant="destructive">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             Smart contract not deployed. Please configure NEXT_PUBLIC_PACKAGE_ID environment variable.
//           </AlertDescription>
//         </Alert>
//       )}
//
//       {step === 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               Step 1: SUI Amount & Gas Fees
//               <TooltipWrapper content="Specify the amount of SUI tokens to include in your will" />
//             </CardTitle>
//             <CardDescription>Enter the amount of SUI tokens you want to allocate in your will</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Balance Display */}
//             <div className="bg-muted p-4 rounded-lg">
//               <div className="flex justify-between items-center">
//                 <span>Your SUI Balance:</span>
//                 <span className="font-medium">{userBalance.toFixed(4)} SUI</span>
//               </div>
//             </div>
//
//             <div className="space-y-2">
//               <Label htmlFor="sui-amount">SUI Amount</Label>
//               <Input
//                 id="sui-amount"
//                 type="number"
//                 placeholder="0.0"
//                 value={suiAmount}
//                 onChange={(e) => setSuiAmount(e.target.value)}
//                 min={SUI_CONFIG.MIN_SUI_AMOUNT}
//                 step="0.001"
//               />
//               <p className="text-sm text-muted-foreground">Minimum: {SUI_CONFIG.MIN_SUI_AMOUNT} SUI</p>
//             </div>
//
//             {/* Gas Fee Estimate */}
//             <div className="bg-muted p-4 rounded-lg space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="flex items-center gap-2">
//                   Gas Fee Estimate
//                   <TooltipWrapper content="Small cost to process transactions on the Sui blockchain" />
//                 </span>
//                 <span className="font-medium">~{gasEstimate.toFixed(6)} SUI</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span>Total Required:</span>
//                 <span className="font-medium">{totalRequired.toFixed(6)} SUI</span>
//               </div>
//               {totalRequired > userBalance && (
//                 <p className="text-sm text-destructive">
//                   Insufficient balance. You need {(totalRequired - userBalance).toFixed(6)} more SUI.
//                 </p>
//               )}
//             </div>
//
//             <div className="flex justify-end">
//               <Button onClick={() => setStep(2)} disabled={!validateStep1() || totalRequired > userBalance}>
//                 Next Step
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//
//       {step === 2 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Step 2: Heirs & Distribution</CardTitle>
//             <CardDescription>Configure your heirs and how your SUI tokens will be distributed</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <Label className="text-base font-medium">Heirs (Max: {SUI_CONFIG.MAX_HEIRS})</Label>
//                 <Button variant="outline" size="sm" onClick={addHeir} disabled={heirs.length >= SUI_CONFIG.MAX_HEIRS}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Heir
//                 </Button>
//               </div>
//
//               {heirs.map((heir, index) => (
//                 <div key={index} className="border rounded-lg p-4 space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium">Heir {index + 1}</h4>
//                     {heirs.length > 1 && (
//                       <Button variant="ghost" size="sm" onClick={() => removeHeir(index)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//
//                   <div className="space-y-2">
//                     <Label htmlFor={`heir-address-${index}`}>Sui Address</Label>
//                     <Input
//                       id={`heir-address-${index}`}
//                       placeholder="0x..."
//                       value={heir.address}
//                       onChange={(e) => updateHeir(index, "address", e.target.value)}
//                       className={heir.address && !validateSuiAddress(heir.address) ? "border-destructive" : ""}
//                     />
//                     <p className="text-sm text-muted-foreground">Must start with 0x and be 66 characters long</p>
//                     {heir.address && !validateSuiAddress(heir.address) && (
//                       <p className="text-sm text-destructive">Invalid Sui address format</p>
//                     )}
//                   </div>
//
//                   <div className="space-y-2">
//                     <Label htmlFor={`heir-percentage-${index}`}>Share Percentage</Label>
//                     <Input
//                       id={`heir-percentage-${index}`}
//                       type="number"
//                       placeholder="0"
//                       value={heir.percentage}
//                       onChange={(e) => updateHeir(index, "percentage", Number.parseInt(e.target.value) || 0)}
//                       min="0"
//                       max="100"
//                     />
//                   </div>
//                 </div>
//               ))}
//
//               <div className="bg-muted p-4 rounded-lg">
//                 <div className="flex justify-between items-center">
//                   <span>Total Percentage:</span>
//                   <span
//                     className={`font-medium ${
//                       heirs.reduce((sum, heir) => sum + heir.percentage, 0) === 100 ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {heirs.reduce((sum, heir) => sum + heir.percentage, 0)}%
//                   </span>
//                 </div>
//                 {heirs.reduce((sum, heir) => sum + heir.percentage, 0) !== 100 && (
//                   <p className="text-sm text-destructive mt-2">Percentages must sum to exactly 100%</p>
//                 )}
//               </div>
//             </div>
//
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="auto-send"
//                   checked={autoSend}
//                   onCheckedChange={(checked) => setAutoSend(checked as boolean)}
//                 />
//                 <Label htmlFor="auto-send" className="flex items-center gap-2">
//                   Auto-Send
//                   <TooltipWrapper content="Automatically sends assets to heirs when triggered" />
//                 </Label>
//               </div>
//
//               <div className="bg-muted p-4 rounded-lg">
//                 <h4 className="font-medium mb-2">Inactivity Condition</h4>
//                 <p className="text-sm text-muted-foreground">Will be executed after 365 days of wallet inactivity</p>
//               </div>
//             </div>
//
//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setStep(1)}>
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Previous
//               </Button>
//               <Button onClick={createWill} disabled={!validateStep2() || isLoading || totalRequired > userBalance}>
//                 {isLoading ? "Creating Will..." : "Create Will"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// 'use client';
//
// import { useState, useEffect } from 'react';
// import { useWallet } from '@suiet/wallet-kit';
// import { TransactionBlock } from '@mysten/sui.js/transactions';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { useToast } from '@/hooks/use-toast';
// import { TooltipWrapper } from '@/components/tooltip-wrapper';
// import { SUI_CONFIG, validateSuiAddress, validateHeirPercentages, isValidPackageId, formatSuiAmount } from '@/lib/sui-config';
// import { ArrowLeft, ArrowRight, Plus, Trash2, AlertTriangle } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
// import {ConnectButton} from "@mysten/dapp-kit";
//
// interface Heir {
//   address: string;
//   percentage: number;
// }
//
// interface WillTransactionParams {
//   suiAmount: number;
//   heirs: Heir[];
//   autoSend: boolean;
// }
//
// export default function CreateWillPage() {
//   const { address, connected, signAndExecuteTransactionBlock } = useWallet();
//   const [step, setStep] = useState(1);
//   const [suiAmount, setSuiAmount] = useState('');
//   const [heirs, setHeirs] = useState<Heir[]>([
//     { address: '', percentage: 50 },
//     { address: '', percentage: 50 },
//   ]);
//   const [autoSend, setAutoSend] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [gasEstimate, setGasEstimate] = useState<number>(0.001);
//   const { toast } = useToast();
//   const router = useRouter();
//
//   // Initialize SuiClient for Testnet
//   const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
//
//   // Fetch user's SUI balance
//   const [balance, setBalance] = useState<number | null>(null);
//
//   useEffect(() => {
//     let mounted = true;
//
//     const fetchBalance = async () => {
//       if (!mounted || !address || !connected) return;
//
//       try {
//         const balanceResponse = await suiClient.getBalance({
//           owner: address,
//         });
//         if (mounted) {
//           setBalance(Number.parseFloat(balanceResponse.totalBalance) / 1_000_000_000);
//         }
//       } catch (err) {
//         if (mounted) {
//           toast({
//             title: 'Balance Fetch Error',
//             description: err instanceof Error ? err.message : 'Failed to load balance',
//             variant: 'destructive',
//           });
//         }
//       }
//     };
//
//     fetchBalance();
//
//     return () => {
//       mounted = false;
//     };
//   }, [address, connected, toast]);
//
//   // Update gas estimate when transaction parameters change
//   useEffect(() => {
//     if (validateStep1() && validateStep2()) {
//       updateGasEstimate();
//     }
//   }, [suiAmount, heirs, autoSend]);
//
//   const updateGasEstimate = async () => {
//     try {
//       const validHeirs = heirs.filter((heir) => heir.address.trim() !== '');
//       const tx = createWillTransaction({
//         suiAmount: Number.parseFloat(suiAmount),
//         heirs: validHeirs,
//         autoSend,
//       });
//       // Note: Actual gas estimation requires dry run; using fallback for now
//       setGasEstimate(0.001); // Placeholder; implement dry run if needed
//     } catch (error) {
//       console.error('Error estimating gas:', error);
//       setGasEstimate(0.001); // Fallback
//     }
//   };
//
//   const createWillTransaction = ({ suiAmount, heirs, autoSend }: WillTransactionParams): TransactionBlock => {
//     const tx = new TransactionBlock();
//     const amountInMist = BigInt(suiAmount * 1_000_000_000);
//     tx.moveCall({
//       target: `${SUI_CONFIG.PACKAGE_ID}::digital_will::create_will`, // Adjust based on your contract
//       arguments: [
//         tx.pure(amountInMist.toString()),
//         tx.pure(heirs.map((h) => h.address)),
//         tx.pure(heirs.map((h) => h.percentage)),
//         tx.pure(autoSend),
//       ],
//     });
//     tx.setGasBudget(SUI_CONFIG.GAS_BUDGET);
//     return tx;
//   };
//
//   const validateStep1 = () => {
//     const amount = Number.parseFloat(suiAmount);
//     return amount >= SUI_CONFIG.MIN_SUI_AMOUNT && !isNaN(amount);
//   };
//
//   const validateStep2 = () => {
//     const validHeirs = heirs.filter((heir) => heir.address.trim() !== '');
//     const validAddresses = validHeirs.every((heir) => validateSuiAddress(heir.address));
//     const validPercentages = validateHeirPercentages(validHeirs);
//
//     return validHeirs.length > 0 && validHeirs.length <= SUI_CONFIG.MAX_HEIRS && validAddresses && validPercentages;
//   };
//
//   const addHeir = () => {
//     if (heirs.length < SUI_CONFIG.MAX_HEIRS) {
//       setHeirs([...heirs, { address: '', percentage: 0 }]);
//     }
//   };
//
//   const removeHeir = (index: number) => {
//     if (heirs.length > 1) {
//       setHeirs(heirs.filter((_, i) => i !== index));
//     }
//   };
//
//   const updateHeir = (index: number, field: keyof Heir, value: string | number) => {
//     const updatedHeirs = [...heirs];
//     updatedHeirs[index] = { ...updatedHeirs[index], [field]: value };
//     setHeirs(updatedHeirs);
//   };
//
//   const createWill = async () => {
//     if (!connected || !address || !validateStep1() || !validateStep2()) return;
//
//     if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
//       toast({
//         title: 'Contract Not Deployed',
//         description: 'The smart contract is not yet deployed. Please check back later or contact support.',
//         variant: 'destructive',
//       });
//       return;
//     }
//
//     setIsLoading(true);
//     try {
//       const validHeirs = heirs.filter((heir) => heir.address.trim() !== '');
//       const tx = createWillTransaction({
//         suiAmount: Number.parseFloat(suiAmount),
//         heirs: validHeirs,
//         autoSend,
//       });
//
//       await signAndExecuteTransactionBlock({
//         transactionBlock: tx,
//         options: {
//           showInput: true,
//           showEffects: true,
//           showEvents: true,
//         },
//       });
//
//       toast({
//         title: 'Will Created Successfully!',
//         description: 'Your will has been created.',
//       });
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Create will error:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'Failed to create will. Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   if (!connected) {
//     return (
//         <div className="max-w-2xl mx-auto space-y-6">
//           <div className="text-center space-y-2">
//             <h1 className="text-3xl font-bold">Create Digital Will</h1>
//             <p className="text-muted-foreground">Secure your SUI tokens for your heirs</p>
//           </div>
//
//           <Alert>
//             <AlertTriangle className="h-4 w-4" />
//             <AlertDescription>
//               <div className="space-y-2">
//                 <p>Connect a wallet to create your digital will.</p>
//                 <div className="sui-wallet-kit">
//                   <ConnectButton connectText="Connect Wallet" />
//                 </div>
//               </div>
//             </AlertDescription>
//           </Alert>
//         </div>
//     );
//   }
//
//   const userBalance = balance !== null ? balance : 0;
//   const totalRequired = Number.parseFloat(suiAmount || '0') + gasEstimate;
//
//   return (
//       <div className="max-w-2xl mx-auto space-y-6">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold">Create Digital Will</h1>
//           <p className="text-muted-foreground">Secure your SUI tokens for your heirs</p>
//         </div>
//
//         {/* Contract Status Warning */}
//         {!isValidPackageId(SUI_CONFIG.PACKAGE_ID) && (
//             <Alert variant="destructive">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>
//                 Smart contract not deployed. Please configure NEXT_PUBLIC_PACKAGE_ID environment variable.
//               </AlertDescription>
//             </Alert>
//         )}
//
//         {step === 1 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   Step 1: SUI Amount & Gas Fees
//                   <TooltipWrapper content="Specify the amount of SUI tokens to include in your will" />
//                 </CardTitle>
//                 <CardDescription>Enter the amount of SUI tokens you want to allocate in your will</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Balance Display */}
//                 <div className="bg-muted p-4 rounded-lg">
//                   <div className="flex justify-between items-center">
//                     <span>Your SUI Balance:</span>
//                     <span className="font-medium">{userBalance.toFixed(4)} SUI</span>
//                   </div>
//                 </div>
//
//                 <div className="space-y-2">
//                   <Label htmlFor="sui-amount">SUI Amount</Label>
//                   <Input
//                       id="sui-amount"
//                       type="number"
//                       placeholder="0.0"
//                       value={suiAmount}
//                       onChange={(e) => setSuiAmount(e.target.value)}
//                       min={SUI_CONFIG.MIN_SUI_AMOUNT}
//                       step="0.001"
//                   />
//                   <p className="text-sm text-muted-foreground">Minimum: {SUI_CONFIG.MIN_SUI_AMOUNT} SUI</p>
//                 </div>
//
//                 {/* Gas Fee Estimate */}
//                 <div className="bg-muted p-4 rounded-lg space-y-2">
//                   <div className="flex items-center justify-between">
//                 <span className="flex items-center gap-2">
//                   Gas Fee Estimate
//                   <TooltipWrapper content="Small cost to process transactions on the Sui blockchain" />
//                 </span>
//                     <span className="font-medium">~{gasEstimate.toFixed(6)} SUI</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span>Total Required:</span>
//                     <span className="font-medium">{totalRequired.toFixed(6)} SUI</span>
//                   </div>
//                   {totalRequired > userBalance && (
//                       <p className="text-sm text-destructive">
//                         Insufficient balance. You need {(totalRequired - userBalance).toFixed(6)} more SUI.
//                       </p>
//                   )}
//                 </div>
//
//                 <div className="flex justify-end">
//                   <Button onClick={() => setStep(2)} disabled={!validateStep1() || totalRequired > userBalance}>
//                     Next Step
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//         )}
//
//         {step === 2 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Step 2: Heirs & Distribution</CardTitle>
//                 <CardDescription>Configure your heirs and how your SUI tokens will be distributed</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <Label className="text-base font-medium">Heirs (Max: {SUI_CONFIG.MAX_HEIRS})</Label>
//                     <Button variant="outline" size="sm" onClick={addHeir} disabled={heirs.length >= SUI_CONFIG.MAX_HEIRS}>
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add Heir
//                     </Button>
//                   </div>
//
//                   {heirs.map((heir, index) => (
//                       <div key={index} className="border rounded-lg p-4 space-y-4">
//                         <div className="flex items-center justify-between">
//                           <h4 className="font-medium">Heir {index + 1}</h4>
//                           {heirs.length > 1 && (
//                               <Button variant="ghost" size="sm" onClick={() => removeHeir(index)}>
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                           )}
//                         </div>
//
//                         <div className="space-y-2">
//                           <Label htmlFor={`heir-address-${index}`}>Sui Address</Label>
//                           <Input
//                               id={`heir-address-${index}`}
//                               placeholder="0x..."
//                               value={heir.address}
//                               onChange={(e) => updateHeir(index, 'address', e.target.value)}
//                               className={heir.address && !validateSuiAddress(heir.address) ? 'border-destructive' : ''}
//                           />
//                           <p className="text-sm text-muted-foreground">Must start with 0x and be 66 characters long</p>
//                           {heir.address && !validateSuiAddress(heir.address) && (
//                               <p className="text-sm text-destructive">Invalid Sui address format</p>
//                           )}
//                         </div>
//
//                         <div className="space-y-2">
//                           <Label htmlFor={`heir-percentage-${index}`}>Share Percentage</Label>
//                           <Input
//                               id={`heir-percentage-${index}`}
//                               type="number"
//                               placeholder="0"
//                               value={heir.percentage}
//                               onChange={(e) => updateHeir(index, 'percentage', Number.parseInt(e.target.value) || 0)}
//                               min="0"
//                               max="100"
//                           />
//                         </div>
//                       </div>
//                   ))}
//
//                   <div className="bg-muted p-4 rounded-lg">
//                     <div className="flex justify-between items-center">
//                       <span>Total Percentage:</span>
//                       <span
//                           className={`font-medium ${
//                               heirs.reduce((sum, heir) => sum + heir.percentage, 0) === 100 ? 'text-green-600' : 'text-red-600'
//                           }`}
//                       >
//                     {heirs.reduce((sum, heir) => sum + heir.percentage, 0)}%
//                   </span>
//                     </div>
//                     {heirs.reduce((sum, heir) => sum + heir.percentage, 0) !== 100 && (
//                         <p className="text-sm text-destructive mt-2">Percentages must sum to exactly 100%</p>
//                     )}
//                   </div>
//                 </div>
//
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                         id="auto-send"
//                         checked={autoSend}
//                         onCheckedChange={(checked) => setAutoSend(checked as boolean)}
//                     />
//                     <Label htmlFor="auto-send" className="flex items-center gap-2">
//                       Auto-Send
//                       <TooltipWrapper content="Automatically sends assets to heirs when triggered" />
//                     </Label>
//                   </div>
//
//                   <div className="bg-muted p-4 rounded-lg">
//                     <h4 className="font-medium mb-2">Inactivity Condition</h4>
//                     <p className="text-sm text-muted-foreground">Will be executed after 365 days of wallet inactivity</p>
//                   </div>
//                 </div>
//
//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={() => setStep(1)}>
//                     <ArrowLeft className="mr-2 h-4 w-4" />
//                     Previous
//                   </Button>
//                   <Button onClick={createWill} disabled={!validateStep2() || isLoading || totalRequired > userBalance}>
//                     {isLoading ? 'Creating Will...' : 'Create Will'}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//         )}
//       </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@suiet/wallet-kit';
import { createWill } from '@/lib/willon-sui';

interface Heir {
  address: string;
  percentage: number;
}

export default function CreateWillPage() {
  const { address, connected, signAndExecuteTransactionBlock } = useWallet();
  const [step, setStep] = useState(1);
  const [heirs, setHeirs] = useState<Heir[]>([{ address: '', percentage: 50 }, { address: '', percentage: 50 }]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!connected || !address) return;
  }, [connected, address]);

  const addHeir = () => {
    if (heirs.length < 5) {
      setHeirs([...heirs, { address: '', percentage: 0 }]);
    }
  };

  const removeHeir = (index: number) => {
    if (heirs.length > 1) {
      setHeirs(heirs.filter((_, i) => i !== index));
    }
  };

  const updateHeir = (index: number, field: keyof Heir, value: string | number) => {
    const updatedHeirs = [...heirs];
    updatedHeirs[index] = { ...updatedHeirs[index], [field]: value };
    setHeirs(updatedHeirs);
  };

  const createWillHandler = async () => {
    if (!connected || !address || !signAndExecuteTransactionBlock) {
      toast({ title: 'Error', description: 'Wallet not ready or not connected.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const validHeirs = heirs.filter((h) => h.address.trim() !== '' && h.percentage > 0);
      const totalPercentage = validHeirs.reduce((sum, h) => sum + h.percentage, 0);
      // if (totalPercentage !== 100) {
      //   toast({ title: 'Error', description: 'Total percentage must equal 100%', variant: 'destructive' });
      //   return;
      // }

      console.log('Creating will with heirs:', validHeirs); // Debug log
      await createWill({ address, connected, signAndExecuteTransactionBlock }, validHeirs);
      toast({ title: 'Will Created Successfully!', description: 'Your will has been created.' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Create will error:', error); // Debug log
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create will.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create Digital Will</h1>
            <p className="text-muted-foreground">Secure your SUI tokens for your heirs</p>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Connect a wallet to create your digital will.</p>
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
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Digital Will</h1>
          <p className="text-muted-foreground">Configure your heirs and distribution</p>
        </div>

        {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Step 1: Heirs & Distribution
                  <TooltipWrapper content="Specify your heirs and their share percentages" />
                </CardTitle>
                <CardDescription>Enter the details for your will</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Heirs (Max: 5)</Label>
                    <Button variant="outline" size="sm" onClick={addHeir} disabled={heirs.length >= 5}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Heir
                    </Button>
                  </div>
                  {heirs.map((heir, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Heir {index + 1}</h4>
                          {heirs.length > 1 && (
                              <Button variant="ghost" size="sm" onClick={() => removeHeir(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`heir-address-${index}`}>Sui Address</Label>
                          <Input
                              id={`heir-address-${index}`}
                              placeholder="0x..."
                              value={heir.address}
                              onChange={(e) => updateHeir(index, 'address', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`heir-percentage-${index}`}>Share Percentage</Label>
                          <Input
                              id={`heir-percentage-${index}`}
                              type="number"
                              placeholder="0"
                              value={heir.percentage}
                              onChange={(e) => updateHeir(index, 'percentage', Number.parseInt(e.target.value) || 0)}
                              min="0"
                              max="100"
                          />
                        </div>
                      </div>
                  ))}
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Total Percentage:</span>
                      <span className={heirs.reduce((sum, h) => sum + h.percentage, 0) === 100 ? 'text-green-600' : 'text-red-600'}>
                    {heirs.reduce((sum, h) => sum + h.percentage, 0)}%
                  </span>
                    </div>
                    {heirs.reduce((sum, h) => sum + h.percentage, 0) !== 100 && (
                        <p className="text-sm text-destructive mt-2">Percentages must sum to exactly 100%</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={createWillHandler} disabled={isLoading || heirs.reduce((sum, h) => sum + h.percentage, 0) !== 100}>
                    {isLoading ? 'Creating...' : 'Create Will'}
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  );
}