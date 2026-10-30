"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  GemIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/registry/ada/components/ada/mode-toggle"
import { AdaBird, AdaLogo } from "@/registry/ada/components/ada/ada-logo"
import { currentUser, formatConversationAge, modeRoutes, navMain } from "@/registry/ada/lib/ada-data"

import { deleteConversation, duplicateConversation, exportConversation, useConversations } from "@/registry/ada/hooks/use-conversations"

const activeItem =
  "data-active:bg-primary data-active:text-primary-foreground data-active:shadow-[0_6px_20px_-6px_oklch(0.6_0.28_320/80%)] data-active:hover:bg-primary/90 data-active:hover:text-primary-foreground"

function AccountMenu() {
  const { isMobile } = useSidebar()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip="My account" className="min-w-0 flex-1 data-open:bg-sidebar-accent">
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
  const router = useRouter()
  const [now, setNow] = React.useState(() => Date.now())

  React.useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000)
    return () => window.clearInterval(interval)
  }, [])
  const { items: conversations } = useConversations()
  const { setOpenMobile, toggleSidebar, state } = useSidebar()
  const activeMode = navMain.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
  const recentConversations = activeMode
    ? conversations.filter((item) => activeMode.href === "/chat" || modeRoutes[item.mode] === activeMode.href)
    : []

  React.useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 flex-row items-center justify-between px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <Link href="/chat" className="group/ada-orb rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:hidden">
          <AdaLogo standalone />
          <span className="sr-only">Ada home</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Expand sidebar"
              aria-expanded={state === "expanded"}
              onClick={toggleSidebar}
              className="group/ada-orb hidden size-9 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:inline-flex"
            >
              <AdaBird branded className="size-8 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/ada-orb:scale-110" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} hidden={state !== "collapsed"}>
            Expand sidebar
          </TooltipContent>
        </Tooltip>
        <SidebarTrigger className="text-muted-foreground group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup className="shrink-0">
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
        {recentConversations.length > 0 && (
          <SidebarGroup className="mt-2 min-h-0 flex-1 pt-3 pb-0 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel asChild className="tracking-wide">
              <h2>LATEST</h2>
            </SidebarGroupLabel>
            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_calc(100%_-_32px),transparent)]">
              <SidebarMenu aria-label="Latest conversations" className="pb-8">
                {recentConversations.map((item) => {
                  const href = `${modeRoutes[item.mode]}/${item.id}`

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === href}
                        className="h-8 gap-2 pr-9 text-muted-foreground hover:text-muted-foreground data-active:text-muted-foreground"
                      >
                        <Link href={href} aria-current={pathname === href ? "page" : undefined}>
                          <span className="min-w-0 truncate">{item.title}</span>
                          <time
                            dateTime={item.updatedAt}
                            suppressHydrationWarning
                            className="shrink-0 text-xs text-muted-foreground/50 tabular-nums"
                          >
                            {formatConversationAge(item, now)}
                          </time>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover aria-label={`More options for ${item.title}`}>
                            <MoreHorizontalIcon />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem onSelect={() => {
                            const copy = duplicateConversation(item.id)
                            if (copy) router.push(`${modeRoutes[copy.mode]}/${copy.id}`)
                          }}>
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => exportConversation(item)}>
                            Export conversation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onSelect={() => {
                            if (pathname === href) router.push(modeRoutes[item.mode])
                            deleteConversation(item.id)
                          }}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarSeparator className="mx-3" />
      <SidebarFooter className="shrink-0 pt-3">
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
          <SidebarMenuItem className="flex items-center gap-1">
            <AccountMenu />
            <ModeToggle className="shrink-0 group-data-[collapsible=icon]:hidden" />
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
