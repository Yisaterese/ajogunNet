// import type React from "react"
// import type { Metadata } from "next"
// import { Inter, Roboto } from "next/font/google"
// import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
// import { SuiProvider } from "@/components/sui-provider"
// import { Navigation } from "@/components/navigation"
// import { Toaster } from "@/components/ui/toaster"
//
// const inter = Inter({ subsets: ["latin"] })
// const roboto = Roboto({
//   weight: ["300", "400", "500", "700", "900"],
//   subsets: ["latin"],
//   variable: "--font-roboto",
// })
//
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${inter.className} ${roboto.variable}`}>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//           <SuiProvider>
//             <div className="min-h-screen bg-background">
//               <Navigation />
//               <main className="container mx-auto px-4 py-8">{children}</main>
//               <Toaster />
//             </div>
//           </SuiProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }
'use client';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import dynamic from 'next/dynamic';
import '@suiet/wallet-kit/style.css';
import { WalletProvider as SuietWalletProvider } from '@suiet/wallet-kit';
import {SuiProvider} from "@/components/sui-provider";

// Dynamically import Suiet WalletProvider to avoid SSR
const WalletProvider = dynamic(() => import('@suiet/wallet-kit').then((mod) => mod.WalletProvider), {
    ssr: false,
});

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({
    weight: ['300', '400', '500', '700', '900'],
    subsets: ['latin'],
    variable: '--font-roboto',
});


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} ${roboto.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SuiProvider>
                <SuietWalletProvider>
                    <WalletProvider autoConnect>
                        <div className="min-h-screen bg-background">
                            <Navigation />
                            <main className="container mx-auto px-4 py-8">{children}</main>
                            <Toaster />
                        </div>
                    </WalletProvider>
                </SuietWalletProvider>
            </SuiProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}