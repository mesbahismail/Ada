"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  MessagesSquareIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UserIcon,
  WandSparklesIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { AdaOrb } from "@/registry/ada/components/ada/ada-logo"
import { ModeToggle } from "@/registry/ada/components/ada/mode-toggle"

function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" />
    </svg>
  )
}

function AuthHeader({ title, backHref = "/" }: { title: string; backHref?: string }) {
  return (
    <header className="flex h-14 items-center gap-2 px-4">
      <Button asChild variant="outline" size="icon-sm" className="rounded-full">
        <Link href={backHref} aria-label="Go back">
          <ChevronLeftIcon />
        </Link>
      </Button>
      <span className="font-heading text-xl">{title}</span>
      <ModeToggle className="ml-auto" />
    </header>
  )
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase">
      <Separator className="flex-1" />
      or
      <Separator className="flex-1" />
    </div>
  )
}

function PasswordInput({ id, placeholder, ...props }: React.ComponentProps<"input">) {
  const [visible, setVisible] = React.useState(false)
  return (
    <InputGroup className="h-10 bg-surface backdrop-blur dark:bg-surface">
      <InputGroupAddon>
        <LockIcon />
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

function IconInput({
  icon: Icon,
  ...props
}: React.ComponentProps<"input"> & { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <InputGroup className="h-10 bg-surface backdrop-blur dark:bg-surface">
      <InputGroupAddon>
        <Icon />
      </InputGroupAddon>
      <InputGroupInput {...props} />
    </InputGroup>
  )
}

function useFakeSubmit() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    window.setTimeout(() => router.push("/search"), 900)
  }
  return { loading, onSubmit }
}

function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { loading, onSubmit } = useFakeSubmit()

  return (
    <div className={cn("flex w-full max-w-sm flex-col items-center gap-8", className)} {...props}>
      <AdaOrb className="size-16" />
      <div className="space-y-1 text-center">
        <h1 className="font-heading text-4xl tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Log in to continue creating with Ada.</p>
      </div>
      <form onSubmit={onSubmit} className="w-full">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="username" className="sr-only">
              Username
            </FieldLabel>
            <IconInput icon={UserIcon} id="username" placeholder="Username or email" autoComplete="username" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="sr-only">
              Password
            </FieldLabel>
            <PasswordInput id="password" placeholder="Password" autoComplete="current-password" required />
            <Link href="#" className="w-fit text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
              Forgot password?
            </Link>
          </Field>
          <Button type="submit" size="lg" className="h-10 w-full rounded-full shadow-[0_8px_24px_-8px_oklch(0.6_0.28_320/80%)]" disabled={loading}>
            {loading && <Spinner />} Log in
          </Button>
          <OrDivider />
          <Button type="button" variant="outline" size="lg" className="h-10 w-full rounded-full bg-surface dark:bg-surface">
            <GoogleIcon /> Sign in with Google
          </Button>
        </FieldGroup>
      </form>
      <p className="text-sm text-muted-foreground">
        New to Ada?{" "}
        <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline">
          Create new account
        </Link>
      </p>
    </div>
  )
}

function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const { loading, onSubmit } = useFakeSubmit()
  const [accepted, setAccepted] = React.useState(false)

  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-8", className)} {...props}>
      <div className="space-y-1 text-center">
        <h1 className="font-heading text-4xl tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Fill in the details below to get started.</p>
      </div>
      <form onSubmit={onSubmit}>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="new-username" className="sr-only">Username</FieldLabel>
            <IconInput icon={UserIcon} id="new-username" placeholder="Username" autoComplete="username" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="email" className="sr-only">Email address</FieldLabel>
            <IconInput icon={MailIcon} id="email" type="email" placeholder="Email address" autoComplete="email" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-password" className="sr-only">Password</FieldLabel>
            <PasswordInput id="new-password" placeholder="Password" autoComplete="new-password" minLength={8} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="repeat-password" className="sr-only">Repeat password</FieldLabel>
            <PasswordInput id="repeat-password" placeholder="Repeat password" autoComplete="new-password" minLength={8} required />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="terms" checked={accepted} onCheckedChange={(value) => setAccepted(value === true)} />
            <FieldLabel htmlFor="terms" className="text-xs font-normal">
              I read and accept the{" "}
              <Link href="#" className="text-primary underline-offset-4 hover:underline">terms of use</Link>
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="promo" />
            <FieldLabel htmlFor="promo" className="text-xs font-normal text-muted-foreground">
              Send me product news and occasional offers
            </FieldLabel>
          </Field>
          <Button type="submit" size="lg" className="h-10 w-full rounded-full shadow-[0_8px_24px_-8px_oklch(0.6_0.28_320/80%)]" disabled={!accepted || loading}>
            {loading && <Spinner />} Create new account
          </Button>
        </FieldGroup>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

const whatsNew = [
  {
    icon: SearchIcon,
    title: "Advanced search",
    description: "Personalized answers from the web, faster and easier than ever before.",
  },
  {
    icon: MessagesSquareIcon,
    title: "Conversational assistance",
    description: "Natural conversations with an assistant that remembers your context.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Control hub",
    description: "Fine-tune settings and generation parameters to fit your workflow.",
  },
  {
    icon: WandSparklesIcon,
    title: "Media generation tools",
    description: "Create images, videos and voiceovers from a single prompt.",
  },
]

function WhatsNewPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center gap-8 overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/25 via-card to-card p-8 backdrop-blur-xl sm:p-10",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/30 blur-3xl" />
      <AdaOrb className="size-14" />
      <div className="relative space-y-2">
        <h2 className="font-heading text-3xl tracking-tight">What&apos;s new in Ada?</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Explore personalized recommendations and unleash your creativity with AI. Let&apos;s get started!
        </p>
      </div>
      <ul className="relative space-y-5">
        {whatsNew.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-surface text-primary">
              <item.icon className="size-4" />
            </span>
            <span className="space-y-0.5">
              <span className="block text-sm font-medium">{item.title}</span>
              <span className="block text-xs text-muted-foreground">{item.description}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { AuthHeader, LoginForm, SignupForm, WhatsNewPanel }
