import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import {TransactionBlock} from "@mysten/sui.js/transactions";

interface WillView {
    index: number;
    heirs: string[];
    shares: number[];
    executed: boolean;
}

interface Heir {
    address: string;
    percentage: number;
}
const gas_budget = 10000000;
const object_id = "0x13c3c9e9b9bc29b0f4621161f1c99ca5a69ab4229297f2627b0be07a251d3fbf";
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

interface WalletContext {
    address: string | undefined;
    connected: boolean;
    signAndExecuteTransactionBlock: (params: { transactionBlock: TransactionBlock; options?: any }) => Promise<any>;
}

export async function getAllWills({ address, connected }: WalletContext): Promise<WillView[]> {
    if (!connected || !address) throw new Error('Wallet not connected');

    try {
        const result = await suiClient.call({
            method: 'sui_callMoveFunction',
            params: ['willon_sui', 'willon_sui', 'get_all_wills', [process.env.NEXT_PUBLIC_WILL_STORE_OBJECT_ID, address]],
        });
        return result as WillView[];
    } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to fetch wills');
    }
}

export async function createWill({ address, connected, signAndExecuteTransactionBlock }: WalletContext, heirs: Heir[]): Promise<void> {
    if (!connected || !address) throw new Error('Wallet not connected');

    const validHeirs = heirs.filter((h) => h.address.trim() !== '' && h.percentage > 0);
    const totalPercentage = validHeirs.reduce((sum, h) => sum + h.percentage, 0);
    // if (totalPercentage !== 100) throw new Error('Total percentage must equal 100%');

    const txb = new TransactionBlock();
    const heirAddresses = validHeirs.map((h) => h.address);
    const shares = validHeirs.map((h) => Math.floor(h.percentage * 100)); // Convert to 10000 scale
    txb.moveCall({
        target: 'willon_sui::willon_sui::create_will',
        arguments: [txb.object(object_id), txb.makeMoveVec({ objects: heirAddresses.map((h) => txb.pure(h)) }), txb.makeMoveVec({ objects: shares.map((s) => txb.pure(s)) })],
    });
    txb.setGasBudget(gas_budget);

    try {
        await signAndExecuteTransactionBlock({
            transactionBlock: txb,
            options: { showEffects: true },
        });
    } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create will');
    }
}

export async function executeWill({ address, connected, signAndExecuteTransactionBlock }: WalletContext, index: number): Promise<void> {
    if (!connected || !address) throw new Error('Wallet not connected');

    const txb = new TransactionBlock();
    const coin = txb.splitCoins(txb.gas, [txb.pure(1000000000)]); // 1 SUI in mist as placeholder
    txb.moveCall({
        target: 'willon_sui::willon_sui::execute_will',
        arguments: [txb.object(object_id), txb.pure(address), txb.pure(index), coin],
    });
    txb.setGasBudget(gas_budget);

    try {
        await signAndExecuteTransactionBlock({
            transactionBlock: txb,
            options: { showEffects: true },
        });
    } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to execute will');
    }
}

export async function revokeWill({ address, connected, signAndExecuteTransactionBlock }: WalletContext, index: number): Promise<void> {
    if (!connected || !address) throw new Error('Wallet not connected');

    const txb = new TransactionBlock();
    txb.moveCall({
        target: 'willon_sui::willon_sui::revoke_will',
        arguments: [txb.object(object_id), txb.pure(index)],
    });
    txb.setGasBudget(gas_budget);

    try {
        await signAndExecuteTransactionBlock({
            transactionBlock: txb,
            options: { showEffects: true },
        });
    } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to revoke will');
    }
}