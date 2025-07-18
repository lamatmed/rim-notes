"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { 
  PanelLeft, 
  X, 
  Search, 
  Settings, 
  Plus, 
  ChevronDown,
  ChevronRight
} from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // Internal state management
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Toggle sidebar handler
  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={100}>
        <div
          style={{ "--sidebar-width": SIDEBAR_WIDTH, ...style } as React.CSSProperties}
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full transition-all",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  // Mobile sidebar
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetOverlay className="bg-background/80 backdrop-blur-sm" />
        <SheetContent
          side={side}
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground transition-all duration-300 ease-in-out"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
        >
          <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-bold">GOAT Notes</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpenMobile(false)}
                className="rounded-full"
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop sidebar
  return (
    <div
      ref={ref}
      className={cn(
        "group hidden h-svh bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:block",
        state === "expanded" ? "w-[--sidebar-width]" : "w-[--sidebar-width-icon]",
        className
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      {...props}
    >
      <ScrollArea className="h-full">
        <div className="flex h-full flex-col">
          <div className="sticky top-0 z-10 bg-sidebar p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold truncate">
                {state === "expanded" ? "GOAT Notes" : "GN"}
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                <ChevronLeft className="size-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 px-2 pb-4">
            {children}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "size-9 rounded-full transition-all hover:bg-accent",
        isMobile ? "flex md:hidden" : "hidden md:flex",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="size-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sticky top-0 z-10 bg-sidebar p-3", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sticky bottom-0 bg-sidebar p-3", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("my-2 bg-border", className)}
    {...props}
  />
))
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto py-2", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { title?: string }
>(({ className, title, children, ...props }, ref) => {
  const { state } = useSidebar()
  
  return (
    <div
      ref={ref}
      className={cn("mb-4", className)}
      {...props}
    >
      {title && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

const sidebarButtonVariants = cva(
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-accent",
        active: "bg-accent text-accent-foreground",
        outline: "border border-border hover:border-primary",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-sm",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    icon?: React.ReactNode
    badge?: React.ReactNode
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant,
      size,
      icon,
      badge,
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { state, isMobile } = useSidebar()
    const isCollapsed = state === "collapsed" && !isMobile

    const content = (
      <Comp
        ref={ref}
        className={cn(
          sidebarButtonVariants({ variant: isActive ? "active" : variant, size, className }),
          "group/button relative"
        )}
        {...props}
      >
        {icon && <span className="flex size-5 items-center justify-center">{icon}</span>}
        <span className={cn(
          "flex-1 truncate transition-opacity",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          {children}
        </span>
        {badge && (
          <span className={cn(
            "ml-auto flex items-center justify-center text-xs",
            isCollapsed ? "absolute right-2 top-1/2 -translate-y-1/2" : ""
          )}>
            {badge}
          </span>
        )}
        {isCollapsed && (
          <div className="absolute inset-0 flex items-center justify-center">
            {icon || <div className="size-1.5 rounded-full bg-muted-foreground" />}
          </div>
        )}
      </Comp>
    )

    if (!tooltip || !isCollapsed) return content

    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" align="center">
          {typeof tooltip === "string" ? tooltip : tooltip.children}
        </TooltipContent>
      </Tooltip>
    )
  }
)
SidebarButton.displayName = "SidebarButton"

const SidebarSearch = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile

  return (
    <div className="relative mb-4 px-2">
      {!isCollapsed && (
        <Input
          ref={ref}
          className={cn(
            "h-9 w-full pl-9 transition-all focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          {...props}
        />
      )}
      <div className={cn(
        "absolute inset-y-0 left-3 flex items-center text-muted-foreground",
        isCollapsed ? "left-1/2 -translate-x-1/2" : ""
      )}>
        <Search className="size-4" />
      </div>
    </div>
  )
})
SidebarSearch.displayName = "SidebarSearch"

const SidebarCollapsible = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    title: string
    icon?: React.ReactNode
    defaultOpen?: boolean
  }
>(({ className, title, icon, defaultOpen = true, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile

  return (
    <div
      ref={ref}
      className={cn("mb-1", className)}
      {...props}
    >
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <span className="mr-2 size-4">{icon}</span>}
        <span className={cn(
          "flex-1 truncate text-left font-medium transition-opacity",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          {title}
        </span>
        {!isCollapsed && (
          <ChevronDown className={cn(
            "ml-auto size-4 transition-transform",
            isOpen ? "rotate-180" : ""
          )} />
        )}
      </Button>

      <div className={cn(
        "mt-1 space-y-1 overflow-hidden transition-all",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  )
})
SidebarCollapsible.displayName = "SidebarCollapsible"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSearch,
  SidebarButton,
  SidebarCollapsible,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
}