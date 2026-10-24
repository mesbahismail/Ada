import type { Metadata } from "next"

import { AuthHeader, LoginForm } from "@/registry/ada/components/ada/auth-forms"

export const metadata: Metadata = {
  title: "Log in",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <AuthHeader title="Login" backHref="/search" />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <LoginForm />
      </main>
    </div>
  )
}
