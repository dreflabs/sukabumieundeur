import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap uppercase tracking-widest font-inter text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-black hover:bg-white shadow-[0_0_20px_rgba(220,38,38,0.15)] hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-white/20 bg-transparent text-white hover:border-brand hover:text-brand",
        secondary:
          "bg-[#111] text-white border border-white/10 hover:bg-[#222]",
        ghost:
          "text-gray-400 hover:text-brand hover:bg-white/5",
        link:
          "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-8 text-sm",
        icon: "h-11 w-11",
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
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
