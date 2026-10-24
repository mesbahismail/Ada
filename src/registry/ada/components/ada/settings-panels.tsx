"use client"

import * as React from "react"
import Link from "next/link"
import { CopyIcon, KeyRoundIcon, MailPlusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const cardClass = "bg-card backdrop-blur-md"

function OrganizationPanel() {
  const orgId = "org-7HF2K9QX4B1M"

  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-normal">Your organization</CardTitle>
        <CardDescription>Billing address and details shown on invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="organization"
          onSubmit={(event) => {
            event.preventDefault()
            toast.success("Organization saved")
          }}
        >
          <FieldGroup>
            <Field className="max-w-sm">
              <FieldLabel htmlFor="org-name">Organization name</FieldLabel>
              <Input id="org-name" defaultValue="Ada Studio" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="address-1">Address line 1</FieldLabel>
                <Input id="address-1" placeholder="Street and number" />
              </Field>
              <Field>
                <FieldLabel htmlFor="address-2">Address line 2</FieldLabel>
                <Input id="address-2" placeholder="Apartment, suite…" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select defaultValue="es">
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Spain</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="ma">Morocco</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="state">State / Province</FieldLabel>
                <Input id="state" placeholder="Enter" />
              </Field>
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" placeholder="Enter" />
              </Field>
              <Field>
                <FieldLabel htmlFor="postal">Postal code</FieldLabel>
                <Input id="postal" placeholder="Enter" />
              </Field>
            </div>
            <Field className="max-w-sm">
              <FieldLabel htmlFor="org-id">Organization ID</FieldLabel>
              <InputGroup>
                <InputGroupInput id="org-id" value={orgId} readOnly className="font-mono" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Copy organization ID"
                    onClick={() => {
                      navigator.clipboard?.writeText(orgId)
                      toast.success("Copied")
                    }}
                  >
                    <CopyIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Use this ID when contacting support.</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="ghost" type="reset" form="organization">
          Cancel
        </Button>
        <Button type="submit" form="organization">
          Save changes
        </Button>
      </CardFooter>
    </Card>
  )
}

const initialMembers = [
  { name: "Jamie Rivera", email: "jamie@ada.app", role: "owner" },
  { name: "Noor Haddad", email: "noor@ada.app", role: "admin" },
  { name: "Leo Martin", email: "leo@ada.app", role: "member" },
]

function MembersPanel() {
  const [members, setMembers] = React.useState(initialMembers)
  const [email, setEmail] = React.useState("")

  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-normal">Members & invites</CardTitle>
        <CardDescription>Invite teammates to collaborate in your workspace.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault()
            if (!email.includes("@")) return
            setMembers((prev) => [...prev, { name: email.split("@")[0], email, role: "member" }])
            setEmail("")
            toast.success(`Invite sent to ${email}`)
          }}
        >
          <Input
            type="email"
            placeholder="teammate@company.com"
            aria-label="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit">
            <MailPlusIcon /> Invite
          </Button>
        </form>
        <Separator />
        <ul className="space-y-3">
          {members.map((member) => (
            <li key={member.email} className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/15 text-xs text-primary uppercase">
                  {member.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize">{member.name}</p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>
              <Select defaultValue={member.role} disabled={member.role === "owner"}>
                <SelectTrigger size="sm" className="w-28" aria-label={`Role for ${member.name}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${member.name}`}
                disabled={member.role === "owner"}
                onClick={() => setMembers((prev) => prev.filter((m) => m.email !== member.email))}
              >
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function BillingPanel() {
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-normal">Plans & billing</CardTitle>
        <CardDescription>You are on the Starter plan, renewing on Nov 24.</CardDescription>
        <CardAction>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/pricing">Upgrade plan</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "AI messages", value: "1,240 / 2,000" },
            { label: "Images", value: "86 / 200" },
            { label: "Voiceover minutes", value: "34 / 60" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-mono text-sm">{item.value}</p>
            </div>
          ))}
        </div>
        <Separator />
        <ul className="divide-y text-sm">
          {["Oct 24, 2026", "Sep 24, 2026", "Aug 24, 2026"].map((date) => (
            <li key={date} className="flex items-center justify-between py-2.5">
              <span>{date}</span>
              <span className="text-muted-foreground">Starter · $29.00</span>
              <Badge variant="secondary">Paid</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function ApiKeysPanel() {
  const [keys, setKeys] = React.useState([
    { name: "Production", key: "sk-ada-••••••••3f9a", created: "Oct 02, 2026" },
    { name: "Local development", key: "sk-ada-••••••••81bc", created: "Sep 14, 2026" },
  ])

  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-normal">API keys</CardTitle>
        <CardDescription>Use keys to call Ada from your own apps. Keep them secret.</CardDescription>
        <CardAction>
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => {
              setKeys((prev) => [
                ...prev,
                { name: `Key ${prev.length + 1}`, key: "sk-ada-••••••••new1", created: "Just now" },
              ])
              toast.success("New key created")
            }}
          >
            <PlusIcon /> New key
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {keys.map((item) => (
            <li key={item.key + item.name} className="flex items-center gap-3 py-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <KeyRoundIcon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{item.key}</p>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">{item.created}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Revoke ${item.name}`}
                onClick={() => setKeys((prev) => prev.filter((k) => k !== item))}
              >
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function LogsPanel() {
  const logs = [
    { event: "image.generated", actor: "Jamie Rivera", time: "2 min ago" },
    { event: "voiceover.exported", actor: "Noor Haddad", time: "1 h ago" },
    { event: "member.invited", actor: "Jamie Rivera", time: "Yesterday" },
    { event: "api_key.created", actor: "Leo Martin", time: "Oct 02" },
  ]

  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-normal">Logs</CardTitle>
        <CardDescription>Recent activity across your organization.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y text-sm">
          {logs.map((log) => (
            <li key={log.event} className="flex items-center gap-3 py-2.5">
              <Badge variant="outline" className="font-mono">
                {log.event}
              </Badge>
              <span className="flex-1 truncate text-muted-foreground">{log.actor}</span>
              <span className="text-xs text-muted-foreground">{log.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function SettingsPanels() {
  return (
    <Tabs defaultValue="organization" className="gap-6">
      <TabsList variant="line" className="no-scrollbar w-full justify-start overflow-x-auto border-b pb-1">
        <TabsTrigger value="members" className="flex-none">Members & invites</TabsTrigger>
        <TabsTrigger value="organization" className="flex-none">Your organization</TabsTrigger>
        <TabsTrigger value="billing" className="flex-none">Plans & billing</TabsTrigger>
        <TabsTrigger value="api" className="flex-none">API keys</TabsTrigger>
        <TabsTrigger value="logs" className="flex-none">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="members">
        <MembersPanel />
      </TabsContent>
      <TabsContent value="organization">
        <OrganizationPanel />
      </TabsContent>
      <TabsContent value="billing">
        <BillingPanel />
      </TabsContent>
      <TabsContent value="api">
        <ApiKeysPanel />
      </TabsContent>
      <TabsContent value="logs">
        <LogsPanel />
      </TabsContent>
    </Tabs>
  )
}

export { SettingsPanels }
