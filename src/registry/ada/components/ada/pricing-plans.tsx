"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { plans, type Plan } from "@/registry/ada/lib/ada-data"

function PlanCard({
  plan,
  yearly,
  current,
  onSelect,
}: {
  plan: Plan
  yearly: boolean
  current: boolean
  onSelect: () => void
}) {
  const price = yearly ? Math.round(plan.monthly * 0.8) : plan.monthly

  return (
    <div
      data-slot="plan-card"
      data-popular={plan.popular}
      className={cn(
        "relative flex flex-col gap-5 rounded-2xl border bg-card p-5 backdrop-blur-md transition-transform hover:-translate-y-0.5",
        plan.popular &&
          "border-primary/70 bg-gradient-to-b from-primary/20 to-card shadow-[0_0_0_1px_var(--primary),0_20px_60px_-20px_oklch(0.6_0.28_320/70%)]"
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-2xl">{plan.name}</h3>
          {plan.popular && <Badge className="rounded-full">Most popular</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>
      <p className="flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight">${price}</span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </p>
      <ul className="flex-1 space-y-2.5 text-sm">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className={cn("flex items-center gap-2.5", !feature.included && "text-muted-foreground/60")}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full",
                feature.included ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              {feature.included ? <CheckIcon className="size-2.5" /> : <XIcon className="size-2.5" />}
            </span>
            {feature.label}
          </li>
        ))}
      </ul>
      <Button
        size="lg"
        variant={current ? "outline" : "default"}
        className="w-full rounded-full"
        disabled={current}
        onClick={onSelect}
      >
        {current ? (
          <>
            <CheckIcon /> Current plan
          </>
        ) : (
          "Upgrade"
        )}
      </Button>
    </div>
  )
}

function PricingPlans({ className, ...props }: React.ComponentProps<"div">) {
  const [yearly, setYearly] = React.useState(false)
  const [current, setCurrent] = React.useState("starter")

  return (
    <div data-slot="pricing-plans" className={cn("flex flex-col items-center gap-8", className)} {...props}>
      <div className="space-y-3 text-center">
        <h2 className="font-heading text-4xl tracking-tight sm:text-5xl">Pricing</h2>
        <p className="mx-auto max-w-md text-sm text-balance text-muted-foreground">
          Unlock the full power of Ada. Flexible plans tailored to your creative needs.
        </p>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Label htmlFor="billing" className={cn(!yearly ? "text-foreground" : "text-muted-foreground")}>
          Monthly
        </Label>
        <Switch id="billing" checked={yearly} onCheckedChange={setYearly} />
        <Label htmlFor="billing" className={cn(yearly ? "text-foreground" : "text-muted-foreground")}>
          Yearly
        </Label>
        <Badge variant="secondary" className="rounded-full text-primary">
          Save 20%
        </Badge>
      </div>
      <div className="grid w-full gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            yearly={yearly}
            current={current === plan.id}
            onSelect={() => {
              setCurrent(plan.id)
              toast.success(`You're now on ${plan.name}`)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export { PricingPlans }
