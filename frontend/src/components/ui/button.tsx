import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          [
            "text-white",
            "bg-gradient-to-b from-[#102a5c] via-[#123873] to-[#2563eb]",
            "shadow-md shadow-blue-900/30",
            "border border-white/10",
            "hover:from-[#12316a] hover:via-[#17438a] hover:to-[#3b82f6]",
            "active:scale-[0.98]",
            "focus-visible:ring-blue-400/50",
          ].join(" "),

        destructive:
          [
            "text-white",
            "bg-gradient-to-b from-rose-600 to-rose-700",
            "shadow-md shadow-rose-900/30",
            "hover:from-rose-700 hover:to-rose-800",
            "focus-visible:ring-rose-400/40",
          ].join(" "),

        outline:
          [
            "relative border border-[#2d4ea8]/50",
            "text-[#2d4ea8]",
            "bg-transparent",
            "overflow-hidden",
            "backdrop-blur-[1px]",
            "transition-all duration-300",
            "focus-visible:ring-blue-400/40",

            "hover:border-[#2563eb]/70",

            "before:absolute before:inset-0",
            "before:bg-gradient-to-r before:from-[#102a5c]/10 before:via-[#2563eb]/10 before:to-[#3b82f6]/10",
            "before:opacity-0 before:transition-opacity before:duration-300 before:rounded-md",
            "hover:before:opacity-100",
            "before:-z-10",
          ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
