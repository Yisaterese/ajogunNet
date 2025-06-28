"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
import { cn, formatAddress, formatSuiAmount, validateSuiAddress } from "@/lib/utils"
import { useCurrentAccount } from "@mysten/dapp-kit"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Create Will", href: "/create" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "FAQ", href: "/faq" },
  { name: "Wallet", href: "/wallet" }, // Added Wallet link
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const currentAccount = useCurrentAccount()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [walletInfo, setWalletInfo] = useState<{ address: string; balance: number } | null>(null)

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

  return (
      <nav className="bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl">AjogunNet</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                  <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                          "text-sm font-medium transition-colors hover:text-primary relative",
                          pathname === item.href ? "text-primary" : "text-muted-foreground",
                      )}
                  >
                    {item.name}
                    {(item.href === "/create" || item.href === "/dashboard") && !currentAccount && (
                        <span
                            className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                            title="Requires wallet connection"
                        />
                    )}
                  </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                  variant="default"
                  onClick={() => setIsModalOpen(true)}
                  disabled={!!walletInfo}
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
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t">
                <div className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                      <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                              "text-sm font-medium transition-colors hover:text-primary px-2 py-1 flex items-center gap-2",
                              pathname === item.href ? "text-primary" : "text-muted-foreground",
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                        {(item.href === "/create" || item.href === "/dashboard") && !currentAccount && (
                            <span
                                className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                                title="Requires wallet connection"
                            />
                        )}
                      </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <Button
                        variant="default"
                        className="w-full"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!!walletInfo}
                    >
                      {walletInfo
                          ? `${formatAddress(walletInfo.address)} (${formatSuiAmount(walletInfo.balance)} SUI)`
                          : "Create Wallet"}
                    </Button>
                  </div>
                </div>
              </div>
          )}

          {/* Wallet Connection Modal */}
          <WalletConnectionModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              currentAccount={currentAccount}
              onWalletCreated={handleWalletCreated}
          />
        </div>
      </nav>
  )
}
// 'use client';
//
// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Menu, X, Moon, Sun } from 'lucide-react';
// import { useTheme } from 'next-themes';
// import { Button } from '@/components/ui/button';
// import { WalletConnection } from '@/components/wallet-connection';
// import { cn } from '@/lib/utils';
// import { useWallet } from '@suiet/wallet-kit';
//
// const navigation = [
//   { name: 'Home', href: '/' },
//   { name: 'Create Will', href: '/create' },
//   { name: 'Dashboard', href: '/dashboard' },
//   { name: 'FAQ', href: '/faq' },
// ];
//
// export function Navigation() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const pathname = usePathname();
//   const { theme, setTheme } = useTheme();
//   const { connected } = useWallet(); // Replace useCurrentAccount with useWallet
//
//   return (
//       <nav className="bg-background border-b">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                 <span className="text-primary-foreground font-bold text-sm">A</span>
//               </div>
//               <span className="font-bold text-xl">AjogunNet</span>
//             </Link>
//
//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               {navigation.map((item) => (
//                   <Link
//                       key={item.name}
//                       href={item.href}
//                       className={cn(
//                           'text-sm font-medium transition-colors hover:text-primary relative',
//                           pathname === item.href ? 'text-primary' : 'text-muted-foreground',
//                       )}
//                   >
//                     {item.name}
//                     {(item.href === '/create' || item.href === '/dashboard') && !connected && (
//                         <span
//                             className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"
//                             title="Requires wallet connection"
//                         />
//                     )}
//                   </Link>
//               ))}
//             </div>
//
//             {/* Desktop Actions */}
//             <div className="hidden md:flex items-center space-x-4">
//               <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//                   aria-label="Toggle theme"
//               >
//                 <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//                 <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               </Button>
//               <div className="sui-wallet-kit">
//                 <WalletConnection />
//               </div>
//             </div>
//
//             {/* Mobile menu button */}
//             <div className="md:hidden flex items-center space-x-2">
//               <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//                   aria-label="Toggle theme"
//               >
//                 <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//                 <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               </Button>
//               <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                   aria-label="Toggle menu"
//               >
//                 {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//               </Button>
//             </div>
//           </div>
//
//           {/* Mobile Navigation */}
//           {mobileMenuOpen && (
//               <div className="md:hidden py-4 border-t">
//                 <div className="flex flex-col space-y-4">
//                   {navigation.map((item) => (
//                       <Link
//                           key={item.name}
//                           href={item.href}
//                           className={cn(
//                               'text-sm font-medium transition-colors hover:text-primary px-2 py-1 flex items-center gap-2',
//                               pathname === item.href ? 'text-primary' : 'text-muted-foreground',
//                           )}
//                           onClick={() => setMobileMenuOpen(false)}
//                       >
//                         {item.name}
//                         {(item.href === '/create' || item.href === '/dashboard') && !connected && (
//                             <span
//                                 className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
//                                 title="Requires wallet connection"
//                             />
//                         )}
//                       </Link>
//                   ))}
//                   <div className="pt-4 border-t">
//                     <div className="sui-wallet-kit">
//                       <WalletConnection />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//           )}
//         </div>
//       </nav>
//   );
// }