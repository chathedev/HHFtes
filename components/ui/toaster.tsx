"use client"

import { Toaster as ShadcnToaster } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ShadcnToaster>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <ShadcnToaster key={id} {...props}>
          <div className="grid gap-1">
            {title && <ShadcnToaster>{title}</ShadcnToaster>}
            {description && <ShadcnToaster>{description}</ShadcnToaster>}
          </div>
          {action}
          <ShadcnToaster />
        </ShadcnToaster>
      ))}
    </ShadcnToaster>
  )
}
