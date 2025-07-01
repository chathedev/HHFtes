"use client"

/**
 * Radix-powered toast primitives + a drop-in <Toaster/> root component.
 * The shadcn styling utilities (`cn`, `cva`) are used for variants.
 */

import * as React from "react"
import {
  ToastViewport,
  Toast as RadixToast,
  ToastAction as RadixToastAction,
  ToastClose as RadixToastClose,
  ToastDescription as RadixToastDescription,
  ToastTitle as RadixToastTitle,
} from "@radix-ui/react-toast"
import { type VariantProps, cva } from "class-variance-authority"
import { X } from "lucide-react"
import { Toaster as SonnerToaster, toast } from "sonner"

import { cn } from "@/lib/utils"

/* ────────────────────────────────────────────────────────────────────────── */
/*  Variants & helpers                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all " +
    "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none " +
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full " +
    "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

/* ────────────────────────────────────────────────────────────────────────── */
/*  Primitive wrappers                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

interface ToastProps extends React.ComponentPropsWithoutRef<typeof RadixToast>, VariantProps<typeof toastVariants> {}

const Toast = React.forwardRef<React.ElementRef<typeof RadixToast>, ToastProps>(
  ({ className, variant, children, ...props }, ref) => (
    <RadixToast ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
      {children}
      {/* Close button that fades in on hover/focus */}
      <RadixToastClose
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        aria-label="Stäng"
      >
        <X className="h-4 w-4" />
      </RadixToastClose>
    </RadixToast>
  ),
)
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<
  React.ElementRef<typeof RadixToastAction>,
  React.ComponentPropsWithoutRef<typeof RadixToastAction>
>(({ className, ...props }, ref) => (
  <RadixToastAction
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

const ToastClose = ToastClosePlaceholder()
function ToastClosePlaceholder() {
  // Already rendered inline inside <Toast>; keep named export for compatibility
  return React.forwardRef<
    React.ElementRef<typeof RadixToastClose>,
    React.ComponentPropsWithoutRef<typeof RadixToastClose>
  >(() => null)
}

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof RadixToastTitle>,
  React.ComponentPropsWithoutRef<typeof RadixToastTitle>
>(({ className, ...props }, ref) => (
  <RadixToastTitle ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof RadixToastDescription>,
  React.ComponentPropsWithoutRef<typeof RadixToastDescription>
>(({ className, ...props }, ref) => (
  <RadixToastDescription ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = "ToastDescription"

/* ────────────────────────────────────────────────────────────────────────── */
/*  Root-level provider component                                           */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Place <Toaster /> once (e.g. in `app/layout.tsx`).
 * All toasts dispatched via your custom hook / context will render here.
 */
export function Toaster() {
  return <SonnerToaster position="bottom-right" richColors closeButton theme="system" />
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Exports                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export { Toast, ToastAction, ToastClose, ToastTitle, ToastDescription, ToastViewport, toast }

// Re-export any types if consumers need them.
