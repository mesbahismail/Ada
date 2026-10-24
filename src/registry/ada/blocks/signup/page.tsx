import type { Metadata } from "next"

import {
  AuthHeader,
  SignupForm,
  WhatsNewPanel,
} from "@/registry/ada/components/ada/auth-forms"

export const metadata: Metadata = {
  title: "Sign up",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <AuthHeader title="Sign up" backHref="/login" />
      <main className="grid flex-1 gap-6 p-4 lg:grid-cols-2 lg:p-6">
        <div className="flex items-center justify-center py-8">
          <SignupForm />
        </div>
        <WhatsNewPanel className="hidden lg:flex" />
      </main>
    </div>
  )
}
