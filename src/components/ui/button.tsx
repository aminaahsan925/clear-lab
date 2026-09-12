import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-primary/92",
        secondary: "border border-border bg-background text-foreground hover:bg-secondary",
        ghost: "text-foreground hover:bg-secondary",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-10 px-4 text-sm",
        icon: "size-10",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };