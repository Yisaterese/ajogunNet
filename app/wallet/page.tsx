"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun, Copy, Maximize2, Bell, ArrowUp, ArrowDown, CreditCard, Building2, RotateCcw, Search, Eye, Settings, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
import { cn, formatAddress, formatSuiAmount, validateSuiAddress } from "@/lib/utils"
import { useCurrentAccount } from "@mysten/dapp-kit"
import Image from "next/image"
import {Input} from "@/components/ui/input";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Create Will", href: "/create" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "FAQ", href: "/faq" },
    { name: "Wallet", href: "/wallet" },
]

export default function WalletPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const currentAccount = useCurrentAccount()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [walletInfo, setWalletInfo] = useState<{ address: string; balance: number } | null>(null)
    const [mounted, setMounted] = useState(false)
    const [mockBalance, setMockBalance] = useState(73) // Initial mocked balance for SUI
    const [assets, setAssets] = useState([
        { id: 1, symbol: "BTC", price: 43250.00, change: "-2.45%", holdings: 0.08834, value: 3818.94, icon: "/images/bitcoin.jpg" },
        { id: 2, symbol: "ETH", price: 2650.00, change: "+1.85%", holdings: 1.2456, value: 3301.84, icon: "/images/ethereum.jpg" },
        { id: 3, symbol: "USDT", price: 1.00, change: "+0.01%", holdings: 3476.04635, value: 3476.87, icon: "/images/usdt-icon.png" },
        { id: 4, symbol: "SUI", price: 2.15, change: "+5.67%", holdings: 1250.50, value: 2688.58, icon: "/images/sui.jpg" },
        { id: 5, symbol: "TON", price: 5.42, change: "-1.21%", holdings: 185.75, value: 1006.77, icon: "/images/ton-icon.jpg" },
        { id: 6, symbol: "WIN", price: 0.0000874, change: "+3.48%", holdings: 3906991.302748, value: 341.43, icon: "/images/win-icon.png" },
        { id: 7, symbol: "SOL", price: 139.38, change: "-0.84%", holdings: 0.002846, value: 0.39, icon: "/images/sol-icon.png" },
    ])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (currentAccount && !walletInfo) {
            if (validateSuiAddress(currentAccount.address)) {
                setWalletInfo({ address: currentAccount.address, balance: mockBalance })
            }
        }
        // Simulate balance update every 5 seconds
        const balanceInterval = setInterval(() => {
            setMockBalance((prev) => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10))
        }, 5000)
        return () => clearInterval(balanceInterval)
    }, [currentAccount, walletInfo, mockBalance])

    useEffect(() => {
        if (currentAccount && !walletInfo) {
            if (validateSuiAddress(currentAccount.address)) {
                setWalletInfo({ address: currentAccount.address, balance: 0 })
            }
        }
    }, [currentAccount, walletInfo])

    const handleWalletCreated = (info: { address: string; balance: number } | null) => {
        if (info && validateSuiAddress(info.address)) {
            setWalletInfo(info)
        }
        setIsModalOpen(false)
    }

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-300">Loading Wallet...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">AjogunNet Wallet</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <Copy className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <Maximize2 className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <Bell className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input placeholder="Search" className="bg-gray-800 border-gray-700 text-white pl-10 py-3 rounded-xl" />
                    </div>
                </div>

                {/* Balance */}
                <div className="px-4 mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-light">{formatSuiAmount(mockBalance)} SUI</span>
                        <Eye className="w-6 h-6 text-gray-400" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between px-4 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                            <ArrowUp className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-300">Send</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                            <ArrowDown className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-300">Receive</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-300">Buy</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-300">Sell</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Link href="/create" className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </Link>
                        <span className="text-sm text-gray-300">Create Will</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                            <RotateCcw className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-300">History</span>
                    </div>
                </div>

                {/* Backup Section */}
                <div className="mx-4 mb-6 bg-gray-800 rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative">
                            <div className="w-12 h-8 bg-pink-400 rounded-lg transform rotate-12 absolute top-2 left-2"></div>
                            <div className="w-12 h-8 bg-green-400 rounded-lg absolute top-0 left-0 flex items-center justify-center">
                                <div className="w-6 h-4 bg-gray-800 rounded-sm flex items-center justify-center">
                                    <div className="w-3 h-1 bg-green-400 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-medium mb-1">Back up to secure your assets</h3>
                            <button className="text-green-400 text-sm flex items-center gap-1">
                                Back up wallet
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-4 mb-6">
                    <div className="flex">
                        <button className="text-white font-medium pb-2 border-b-2 border-green-400 mr-8">Crypto</button>
                        <button className="text-gray-400 font-medium pb-2">NFTs</button>
                    </div>
                </div>

                {/* Mobile Crypto List */}
                <div className="px-4 space-y-4">
                    {assets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                        src={asset.icon}
                                        alt={asset.symbol}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{asset.symbol}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-300 text-sm">${asset.price.toFixed(2)}</span>
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className={`w-3 h-3 ${asset.change.includes("+") ? "text-green-400" : "text-red-400"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                                    clipRule="evenodd"
                                                    transform={asset.change.includes("+") ? "" : "rotate(180 10 10)"}
                                                />
                                            </svg>
                                            <span className={`${asset.change.includes("+") ? "text-green-400" : "text-red-400"} text-sm`}>
                        {asset.change}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{asset.holdings.toLocaleString()}</div>
                                <div className="text-gray-400 text-sm">${asset.value.toFixed(2)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">W</span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-white">AjogunNet Wallet</h2>
                                <p className="text-sm text-gray-400">Main Wallet</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <div className="space-y-2">
                            <Button className="w-full flex items-center gap-3 px-3 py-2 text-left text-white bg-gray-700 rounded-lg">
                                <Copy className="w-5 h-5" />
                                Portfolio
                            </Button>
                            <Button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <ArrowUp className="w-5 h-5" />
                                Send
                            </Button>
                            <Button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <ArrowDown className="w-5 h-5" />
                                Receive
                            </Button>
                            <Button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <CreditCard className="w-5 h-5" />
                                Buy/Sell
                            </Button>
                            <Link href="/create-will" className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Will
                            </Link>
                            <Button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <RotateCcw className="w-5 h-5" />
                                History
                            </Button>
                        </div>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="space-y-2">
                            <Button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <Settings className="w-5 h-5" />
                                Settings
                            </Button>
                            <Button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <HelpCircle className="w-5 h-5" />
                                Help
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Header */}
                    <header className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-gray-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold text-white">Portfolio Overview</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="default"
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={!!walletInfo}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {walletInfo
                                        ? `${formatAddress(walletInfo.address)} (${formatSuiAmount(walletInfo.balance)} SUI)`
                                        : "Create Wallet"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    aria-label="Toggle theme"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Main Dashboard */}
                    <main className="flex-1 p-6 overflow-auto">
                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 mb-2">Total Portfolio Value</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-light text-white">{formatSuiAmount(mockBalance)} SUI</span>
                                        <Eye className="w-6 h-6 text-blue-200" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-green-300">+2.34% (24h)</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <ArrowUp className="w-4 h-4 mr-2" />
                                        Send
                                    </Button>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <ArrowDown className="w-4 h-4 mr-2" />
                                        Receive
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section (Placeholder) */}
                        <div className="mb-6"></div>

                        {/* Backup Alert */}
                        <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-yellow-500/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 relative">
                                    <div className="w-8 h-6 bg-pink-400 rounded-lg transform rotate-12 absolute top-1 left-1"></div>
                                    <div className="w-8 h-6 bg-green-400 rounded-lg absolute top-0 left-0 flex items-center justify-center">
                                        <div className="w-4 h-2 bg-gray-800 rounded-sm flex items-center justify-center">
                                            <div className="w-2 h-0.5 bg-green-400 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium mb-1">Back up to secure your assets</h3>
                                    <p className="text-gray-400 text-sm">Protect your wallet with a secure backup</p>
                                </div>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Back up wallet</Button>
                            </div>
                        </div>

                        {/* Crypto Holdings Table */}
                        <div className="bg-gray-800 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white">Your Assets</h2>
                                    <div className="flex gap-2">
                                        <Button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Crypto</Button>
                                        <Button className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg text-sm">NFTs</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Asset</th>
                                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Price</th>
                                        <th className="text-left py-4 px-6 text-gray-400 font-medium">24h Change</th>
                                        <th className="text-right py-4 px-6 text-gray-400 font-medium">Holdings</th>
                                        <th className="text-right py-4 px-6 text-gray-400 font-medium">Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {assets.map((asset) => (
                                        <tr key={asset.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                                        <Image
                                                            src={asset.icon}
                                                            alt={asset.symbol}
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{asset.symbol}</div>
                                                        <div className="text-sm text-gray-400">{asset.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-white">${asset.price.toFixed(2)}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1">
                                                    <svg
                                                        className={`w-4 h-4 ${asset.change.includes("+") ? "text-green-400" : "text-red-400"}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                                            clipRule="evenodd"
                                                            transform={asset.change.includes("+") ? "" : "rotate(180 10 10)"}
                                                        />
                                                    </svg>
                                                    <span className={`${asset.change.includes("+") ? "text-green-400" : "text-red-400"}`}>
                              {asset.change}
                            </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right text-white">{asset.holdings.toLocaleString()}</td>
                                            <td className="py-4 px-6 text-right text-white font-medium">${asset.value.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Wallet Connection Modal */}
            <WalletConnectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentAccount={currentAccount}
                onWalletCreated={handleWalletCreated}
            />
        </div>
    )
}