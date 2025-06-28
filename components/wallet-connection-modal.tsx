"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { validateSuiAddress } from "@/lib/utils"

interface WalletConnectionModalProps {
    isOpen: boolean
    onClose: () => void
    currentAccount: ReturnType<typeof useCurrentAccount> | null
    onWalletCreated: (info: { address: string; balance: number } | null) => void
}

interface WalletResponse {
    address: string
    balance: number
    signature: string
}

function generateSuiAddress(): string {
    // Generate a random 64-character hexadecimal string
    const hexChars = "0123456789abcdef"
    let randomHex = "0x"
    for (let i = 0; i < 64; i++) {
        randomHex += hexChars[Math.floor(Math.random() * hexChars.length)]
    }
    return randomHex
}

export function WalletConnectionModal({ isOpen, onClose, currentAccount, onWalletCreated }: WalletConnectionModalProps) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (currentAccount) {
            onWalletCreated({ address: currentAccount.address, balance: 0 })
        }
    }, [currentAccount, onWalletCreated])

    const handleSubmit = async () => {
        if (!username || !password) {
            setError("Username and password are required.")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Simulate backend API call to create wallet and receive signature
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate 1-second delay
            const dummyResponse: WalletResponse = {
                address: generateSuiAddress(),
                balance: Math.floor(Math.random() * 100),
                signature: "0x1234567890abcdef",
            }
            console.log("Dummy backend response:", dummyResponse)
            // In a real scenario, replace with fetch:
            // const response = await fetch("/api/create-wallet", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ username, password }),
            // })
            // const data = await response.json()
            // if (!response.ok) throw new Error("Wallet creation failed")
            // if (!validateSuiAddress(data.address)) throw new Error("Invalid address from backend")

            if (validateSuiAddress(dummyResponse.address)) {
                onWalletCreated({ address: dummyResponse.address, balance: dummyResponse.balance })
            } else {
                throw new Error("Invalid address received from backend")
            }
        } catch (err) {
            setError("Failed to create wallet. Invalid credentials or server issue.")
            console.error("Submission error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Wallet</DialogTitle>
                    <DialogDescription>
                        Enter your credentials to create a wallet securely.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter your username"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-destructive text-center col-span-4">{error}</p>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}