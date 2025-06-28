'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock, getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import {ConnectButton} from "@suiet/wallet-kit";
import { SUI_CONFIG } from '@/lib/sui-config';

interface WillView {
    index: number;
    heirs: string[];
    shares: number[];
    executed: bool;
}

const WILL_STORE_OBJECT_ID = '0xYOUR_WILL_STORE_OBJECT_ID'; // Replace with deployed ID

export function WillManagement() {
    const { address, connected, signAndExecuteTransactionBlock } = useWallet();
    const [wills, setWills] = useState<WillView[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

    useEffect(() => {
        if (connected && address) {
            fetchWills();
        }
    }, [connected, address]);

    const fetchWills = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await suiClient.call({
                method: 'sui_callMoveFunction',
                params: ['willon_sui', 'willon_sui', 'get_all_wills', [WILL_STORE_OBJECT_ID, address]],
            });
            setWills(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch wills');
            toast({
                title: 'Error',
                description: error,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const createWill = async () => {
        if (!connected || !address) return;

        setIsLoading(true);
        try {
            const txb = new TransactionBlock();
            const heirs = ['0xHEIR1_ADDRESS', '0xHEIR2_ADDRESS']; // Replace with dynamic input
            const shares = [5000, 5000]; // 50% each
            txb.moveCall({
                target: 'willon_sui::willon_sui::create_will',
                arguments: [txb.object(WILL_STORE_OBJECT_ID), txb.makeMoveVec({ objects: heirs.map((h) => txb.pure(h)) }), txb.makeMoveVec({ objects: shares.map((s) => txb.pure(s)) })],
            });
            txb.setGasBudget(SUI_CONFIG.GAS_BUDGET);

            await signAndExecuteTransactionBlock({
                transactionBlock: txb,
                options: { showEffects: true },
            });
            toast({ title: 'Will Created', description: 'Will has been created successfully.' });
            fetchWills();
        } catch (err) {
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to create will.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const executeWill = async (index: number) => {
        if (!connected || !address) return;

        setIsLoading(true);
        try {
            const txb = new TransactionBlock();
            const coin = txb.splitCoins(txb.gas, [txb.pure(1000000000)]); // 1 SUI in mist as placeholder
            txb.moveCall({
                target: 'willon_sui::willon_sui::execute_will',
                arguments: [txb.object(WILL_STORE_OBJECT_ID), txb.pure(address), txb.pure(index), coin],
            });
            txb.setGasBudget(SUI_CONFIG.GAS_BUDGET);

            await signAndExecuteTransactionBlock({
                transactionBlock: txb,
                options: { showEffects: true },
            });
            toast({ title: 'Will Executed', description: 'Will has been executed successfully.' });
            fetchWills();
        } catch (err) {
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to execute will.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const revokeWill = async (index: number) => {
        if (!connected || !address) return;

        setIsLoading(true);
        try {
            const txb = new TransactionBlock();
            txb.moveCall({
                target: 'willon_sui::willon_sui::revoke_will',
                arguments: [txb.object(WILL_STORE_OBJECT_ID), txb.pure(index)],
            });
            txb.setGasBudget(SUI_CONFIG.GAS_BUDGET);

            await signAndExecuteTransactionBlock({
                transactionBlock: txb,
                options: { showEffects: true },
            });
            toast({ title: 'Will Revoked', description: 'Will has been revoked successfully.' });
            fetchWills();
        } catch (err) {
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to revoke will.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!connected) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <div className="space-y-2">
                            <p>Connect your wallet to manage wills.</p>
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
            <Card>
                <CardHeader>
                    <CardTitle>Will Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={createWill} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create New Will'}
                    </Button>
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <h3 className="font-medium">Your Wills</h3>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : wills.length === 0 ? (
                            <p>No wills found. Create one to get started!</p>
                        ) : (
                            wills.map((will) => (
                                <div key={will.index} className="border rounded-lg p-2 flex justify-between items-center">
                                    <span>Will #{will.index} - {will.executed ? 'Executed' : 'Active'}</span>
                                    {!will.executed && (
                                        <div>
                                            <Button variant="outline" onClick={() => executeWill(will.index)} className="mr-2">
                                                Execute
                                            </Button>
                                            <Button variant="destructive" onClick={() => revokeWill(will.index)}>
                                                Revoke
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}