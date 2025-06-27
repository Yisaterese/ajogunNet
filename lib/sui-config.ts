// Sui blockchain configuration and contract addresses
export const SUI_CONFIG = {
  // Contract Package ID - replace with your deployed contract
  PACKAGE_ID:
    process.env.NEXT_PUBLIC_PACKAGE_ID || "0x0000000000000000000000000000000000000000000000000000000000000000",

  // Module names
  MODULE_NAME: "digital_will",

  // Function names
  FUNCTIONS: {
    CREATE_WILL: "create_will",
    QUERY_WILL: "query_will",
    REVOKE_WILL: "revoke_will",
    EXECUTE_WILL: "execute_will",
    TRIGGER_WILL: "trigger_will",
  },

  // Event types
  EVENTS: {
    WILL_CREATED: "WillCreated",
    WILL_REVOKED: "WillRevoked",
    WILL_EXECUTED: "WillExecuted",
  },

  // Network settings
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || "testnet",

  // Gas budget for transactions
  GAS_BUDGET: 10000000, // 0.01 SUI

  // Minimum SUI amount for will creation
  MIN_SUI_AMOUNT: 0.001,

  // Maximum number of heirs
  MAX_HEIRS: 10,
} as const

// Validation functions
export function isValidPackageId(packageId: string): boolean {
  return (
    packageId !== "0x0000000000000000000000000000000000000000000000000000000000000000" &&
    packageId.startsWith("0x") &&
    packageId.length === 66
  )
}

export function getContractAddress(functionName: string): string {
  if (!isValidPackageId(SUI_CONFIG.PACKAGE_ID)) {
    throw new Error("Contract package ID not configured. Please set NEXT_PUBLIC_PACKAGE_ID environment variable.")
  }
  return `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${functionName}`
}

// Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
export function suiToMist(suiAmount: number): string {
  return Math.floor(suiAmount * 1_000_000_000).toString()
}

// Convert MIST to SUI
export function mistToSui(mistAmount: string | number): number {
  return Number(mistAmount) / 1_000_000_000
}

// Format SUI amount for display
export function formatSuiAmount(amount: number, decimals = 4): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(amount)
}

// Validate heir address
export function validateSuiAddress(address: string): boolean {
  return address.startsWith("0x") && address.length === 66
}

// Validate heir percentages
export function validateHeirPercentages(heirs: Array<{ percentage: number }>): boolean {
  const total = heirs.reduce((sum, heir) => sum + heir.percentage, 0)
  return total === 100 && heirs.every((heir) => heir.percentage > 0 && heir.percentage <= 100)
}
