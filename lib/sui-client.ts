"use client"

import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit"
import { TransactionBlock } from "@mysten/sui.js/transactions"
import { SUI_CONFIG, getContractAddress, suiToMist, mistToSui, isValidPackageId } from "./sui-config"

// Types for Will data structure
export interface WillData {
  id: string
  owner: string
  suiAmount: number
  heirs: Array<{
    address: string
    percentage: number
  }>
  status: "Active" | "Executed" | "Revoked"
  autoSend: boolean
  createdAt: string
  lastActivity?: string
}

export interface CreateWillParams {
  suiAmount: number
  heirs: Array<{
    address: string
    percentage: number
  }>
  autoSend: boolean
}

// Custom hook for Will operations
export function useWillOperations() {
  const suiClient = useSuiClient()
  const currentAccount = useCurrentAccount()

  // Create a new will
  const createWillTransaction = (params: CreateWillParams): TransactionBlock => {
    if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
      throw new Error("Smart contract not deployed. Please configure NEXT_PUBLIC_PACKAGE_ID.")
    }

    const tx = new TransactionBlock()

    try {
      // Convert SUI amount to MIST
      const amountInMist = suiToMist(params.suiAmount)

      // Prepare heir addresses and percentages
      const heirAddresses = params.heirs.map((h) => h.address)
      const heirPercentages = params.heirs.map((h) => h.percentage)

      // Create the will transaction
      tx.moveCall({
        target: getContractAddress(SUI_CONFIG.FUNCTIONS.CREATE_WILL),
        arguments: [tx.pure(amountInMist), tx.pure(heirAddresses), tx.pure(heirPercentages), tx.pure(params.autoSend)],
      })

      // Set gas budget
      tx.setGasBudget(SUI_CONFIG.GAS_BUDGET)

      return tx
    } catch (error) {
      console.error("Error creating will transaction:", error)
      throw new Error(`Failed to create will transaction: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Revoke an existing will
  const revokeWillTransaction = (willId: string): TransactionBlock => {
    if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
      throw new Error("Smart contract not deployed. Please configure NEXT_PUBLIC_PACKAGE_ID.")
    }

    const tx = new TransactionBlock()

    try {
      tx.moveCall({
        target: getContractAddress(SUI_CONFIG.FUNCTIONS.REVOKE_WILL),
        arguments: [tx.pure(willId)],
      })

      tx.setGasBudget(SUI_CONFIG.GAS_BUDGET)

      return tx
    } catch (error) {
      console.error("Error creating revoke transaction:", error)
      throw new Error(
        `Failed to create revoke transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  // Query wills for current account
  const queryUserWills = async (): Promise<WillData[]> => {
    if (!currentAccount?.address) {
      throw new Error("No wallet connected")
    }

    if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
      console.warn("Smart contract not deployed, returning mock data")
      return getMockWillData()
    }

    try {
      // Query blockchain for user's wills
      const result = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::Will`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      })

      // Parse and format will data
      const wills: WillData[] = result.data
        .map((obj: any) => {
          const content = obj.data?.content?.fields
          if (!content) return null

          return {
            id: obj.data.objectId,
            owner: content.owner,
            suiAmount: mistToSui(content.sui_amount),
            heirs:
              content.heirs?.map((heir: any) => ({
                address: heir.address,
                percentage: heir.percentage,
              })) || [],
            status: content.status || "Active",
            autoSend: content.auto_send || false,
            createdAt: new Date(Number(content.created_at) * 1000).toISOString().split("T")[0],
            lastActivity: content.last_activity
              ? new Date(Number(content.last_activity) * 1000).toISOString().split("T")[0]
              : undefined,
          }
        })
        .filter(Boolean)

      return wills
    } catch (error) {
      console.error("Error querying wills:", error)
      // Fallback to mock data if query fails
      console.warn("Falling back to mock data due to query error")
      return getMockWillData()
    }
  }

  // Get gas fee estimate
  const estimateGasFee = async (transactionBlock: TransactionBlock): Promise<number> => {
    if (!currentAccount?.address) {
      return 0.001 // Default estimate
    }

    try {
      const dryRunResult = await suiClient.dryRunTransactionBlock({
        transactionBlock: transactionBlock.serialize(),
      })

      const gasFee = dryRunResult.effects.gasUsed
      return mistToSui(gasFee.computationCost + gasFee.storageCost)
    } catch (error) {
      console.error("Error estimating gas fee:", error)
      return 0.001 // Fallback estimate
    }
  }

  return {
    createWillTransaction,
    revokeWillTransaction,
    queryUserWills,
    estimateGasFee,
  }
}

// Mock data for development/testing
function getMockWillData(): WillData[] {
  return [
    {
      id: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
      owner: "0x987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba09",
      suiAmount: 10.5,
      heirs: [
        { address: "0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345", percentage: 60 },
        { address: "0x789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789", percentage: 40 },
      ],
      status: "Active",
      autoSend: true,
      createdAt: "2024-01-15",
      lastActivity: "2024-01-20",
    },
    {
      id: "0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
      owner: "0x987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba09",
      suiAmount: 5.0,
      heirs: [{ address: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456", percentage: 100 }],
      status: "Active",
      autoSend: false,
      createdAt: "2024-01-10",
    },
  ]
}

// Event listener for will-related events
export function useWillEvents() {
  const suiClient = useSuiClient()

  const subscribeToWillEvents = (callback: (event: any) => void) => {
    if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
      console.warn("Cannot subscribe to events: Contract not deployed")
      return () => {} // Return empty unsubscribe function
    }

    try {
      const unsubscribe = suiClient.subscribeEvent({
        filter: {
          Package: SUI_CONFIG.PACKAGE_ID,
        },
        onMessage: (event) => {
          console.log("Will event received:", event)
          callback(event)
        },
      })

      return unsubscribe
    } catch (error) {
      console.error("Error subscribing to events:", error)
      return () => {}
    }
  }

  return { subscribeToWillEvents }
}
