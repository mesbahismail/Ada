"use client"

import * as React from "react"
import { BellIcon, CheckIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type ComingSoonProps = {
  icon: React.ReactNode
  title?: string
  description?: string
}

function ComingSoon({
  icon,
  title = "Coming soon",
  description = "This feature is currently not available. We'll let you know as soon as it ships.",
}: ComingSoonProps) {
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <Empty className="animate-in fade-in-0 zoom-in-95 duration-500">
      <EmptyHeader>
        <EmptyMedia className="relative">
          <span className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl" />
          <span className="relative flex size-14 items-center justify-center rounded-2xl border bg-surface text-primary backdrop-blur [&_svg:not([class*='size-'])]:size-6">
            {icon}
          </span>
        </EmptyMedia>
        <EmptyTitle className="font-heading text-3xl font-normal">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          className="rounded-full"
          disabled={subscribed}
          onClick={() => {
            setSubscribed(true)
            toast.success("We'll email you when it's ready")
          }}
        >
          {subscribed ? <CheckIcon /> : <BellIcon />}
          {subscribed ? "You're on the list" : "Notify me"}
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export { ComingSoon }
