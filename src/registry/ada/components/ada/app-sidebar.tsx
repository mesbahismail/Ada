"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  GemIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { AdaLogo, AdaMark } from "@/registry/ada/components/ada/ada-logo"
import { currentUser, navMain } from "@/registry/ada/lib/ada-data"

const activeItem =
  "data-active:bg-primary data-active:text-primary-foreground data-active:shadow-[0_6px_20px_-6px_oklch(0.6_0.28_320/80%)] data-active:hover:bg-primary/90 data-active:hover:text-primary-foreground"

function AccountMenu() {
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip="My account" className="data-open:bg-sidebar-accent">
          <Avatar className="size-5 after:hidden">
            <AvatarFallback className="bg-gradient-to-br from-amber-200 to-rose-400 text-[9px] font-semibold text-rose-950">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <span>My account</span>
          <ChevronsUpDownIcon className="ml-auto text-muted-foreground" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "top" : "right"}
        align="end"
        sideOffset={8}
        className="w-60"
      >
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <Avatar className="size-8">
            <AvatarFallback className="bg-gradient-to-br from-amber-200 to-rose-400 text-xs font-semibold text-rose-950">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-medium text-foreground">{currentUser.name}</span>
            <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <UserIcon /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/pricing">
              <CreditCardIcon /> Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunIcon className="dark:hidden" />
              <MoonIcon className="hidden dark:block" /> Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <SunIcon /> Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <MoonIcon /> Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <MonitorIcon /> System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/login">
            <LogOutIcon /> Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  React.useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 flex-row items-center justify-between px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <Link href="/search" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
          <AdaLogo className="group-data-[collapsible=icon]:hidden" />
          <AdaMark className="hidden group-data-[collapsible=icon]:inline-flex" />
          <span className="sr-only">Ada home</span>
        </Link>
        <SidebarTrigger className="text-muted-foreground group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navMain.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname.startsWith(item.href)}
                  className={activeItem}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge className="rounded-full bg-primary/15 px-1.5 text-[10px] text-primary peer-data-active/menu-button:bg-white/20 peer-data-active/menu-button:text-white">
                    {item.badge}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Upgrade plan"
              isActive={pathname.startsWith("/pricing")}
              className={activeItem}
            >
              <Link href="/pricing">
                <GemIcon />
                <span>Upgrade plan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              isActive={pathname.startsWith("/settings")}
              className={activeItem}
            >
              <Link href="/settings">
                <SettingsIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <AccountMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

/**
 * Collapses the sidebar to icons while mounted (editor & settings screens)
 * and restores the user's preference when leaving.
 */
function SidebarAutoCollapse() {
  const { open, setOpen } = useSidebar()
  const [wasOpen] = React.useState(open)
  const setOpenRef = React.useRef(setOpen)

  React.useEffect(() => {
    setOpenRef.current = setOpen
  }, [setOpen])

  React.useEffect(() => {
    setOpenRef.current(false)
    return () => setOpenRef.current(wasOpen)
  }, [wasOpen])

  return null
}

export { AppSidebar, SidebarAutoCollapse }
