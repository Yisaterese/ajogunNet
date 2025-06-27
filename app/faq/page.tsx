"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How do I create a digital will?",
    answer:
      "Creating a digital will is simple: 1) Connect your Sui wallet, 2) Specify the amount of SUI tokens to include, 3) Add heir addresses and their share percentages, 4) Configure auto-send settings, and 5) Sign the transaction to create your will on the blockchain.",
  },
  {
    question: "How do I install and set up a Sui Wallet?",
    answer:
      "To get started with Sui Wallet: 1) Visit the official Sui Wallet website, 2) Download the browser extension or mobile app, 3) Create a new wallet or import an existing one, 4) Securely store your seed phrase, and 5) Fund your wallet with SUI tokens. Always download from official sources to ensure security.",
    link: "https://docs.sui.io/guides/developer/getting-started/sui-install",
  },
  {
    question: "How do heirs receive SUI tokens?",
    answer:
      "When a will is executed, heirs automatically receive their allocated SUI tokens directly to their wallet addresses. They need to have a Sui wallet set up to receive the tokens. The distribution happens according to the percentages specified in the will.",
  },
  {
    question: "What happens if I want to change my will?",
    answer:
      "You can revoke your existing will at any time while it's active. Once revoked, your locked SUI tokens are returned to your wallet, and you can create a new will with updated terms. There's no way to modify an existing will - you must revoke and create a new one.",
  },
  {
    question: "What are gas fees and why do I need to pay them?",
    answer:
      "Gas fees are small transaction costs required to process operations on the Sui blockchain. They compensate network validators for processing and securing your transactions. Gas fees are typically very low on Sui, usually around 0.001 SUI per transaction.",
  },
  {
    question: "How does auto-send work?",
    answer:
      "Auto-send automatically distributes your SUI tokens to heirs when certain conditions are met, such as wallet inactivity for a specified period. If disabled, the will requires manual execution by an authorized party.",
  },
  {
    question: "Is my will secure on the blockchain?",
    answer:
      "Yes, your will is stored on the Sui blockchain, making it immutable and tamper-proof. Only you can revoke your will while it's active. The smart contract ensures that the terms of your will are executed exactly as specified, without the possibility of interference.",
  },
  {
    question: "Can I have multiple wills?",
    answer:
      "Yes, you can create multiple wills with different amounts and heir configurations. Each will operates independently, and you can manage them all from your dashboard. This allows you to organize your digital assets across different purposes or beneficiaries.",
  },
  {
    question: "What happens if an heir's address is invalid?",
    answer:
      "The system validates heir addresses before creating a will. Addresses must start with '0x' and be exactly 66 characters long. If an invalid address is detected, the will creation will fail, and you'll need to correct the address before proceeding.",
  },
  {
    question: "How long does it take to create a will?",
    answer:
      "Creating a will typically takes just a few minutes. The actual blockchain transaction usually confirms within seconds on the Sui network. The longest part is usually filling out the heir information and double-checking the details.",
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">Everything you need to know about AjogunNet</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <Collapsible open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-left text-lg font-medium">{faq.question}</CardTitle>
                    <ChevronDown
                      className={cn("h-5 w-5 transition-transform", openItems.includes(index) && "rotate-180")}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  {faq.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={faq.link} target="_blank" rel="noopener noreferrer">
                        Learn More
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  )
}
