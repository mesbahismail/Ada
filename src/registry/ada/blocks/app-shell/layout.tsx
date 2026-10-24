import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/registry/ada/components/ada/app-sidebar"

export default function AdaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden bg-transparent">{children}</SidebarInset>
    </SidebarProvider>
  )
}
