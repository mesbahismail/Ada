import type { Metadata } from "next"

import { PageHeader } from "@/registry/ada/components/ada/page-header"
import { PricingPlans } from "@/registry/ada/components/ada/pricing-plans"

export const metadata: Metadata = {
  title: "Pricing",
}

export default function PricingPage() {
  return (
    <div className="flex h-svh min-h-0 flex-col">
      <PageHeader title="Upgrade plan" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PricingPlans className="mx-auto max-w-5xl px-4 py-10 sm:py-14" />
      </div>
    </div>
  )
}
