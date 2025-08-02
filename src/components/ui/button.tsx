import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Korean BBQ specific variants
        korean: "bg-gradient-hero text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-glow font-semibold",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:scale-[1.02] active:scale-[0.98] shadow-md",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover:scale-[1.02] active:scale-[0.98] shadow-md",
        shared: "bg-split-shared text-success-foreground hover:bg-split-shared/90 border-l-4 border-l-split-shared/50",
        individual: "bg-split-individual text-primary-foreground hover:bg-split-individual/90 border-l-4 border-l-split-individual/50",
        tablet: "bg-surface-elevated text-text-primary hover:bg-neutral-warm border border-border shadow-card hover:shadow-elevated text-base font-medium min-h-[48px]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        tablet: "h-12 px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
