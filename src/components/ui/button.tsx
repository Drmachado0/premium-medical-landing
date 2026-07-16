import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium tracking-tight ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-border bg-transparent text-foreground hover:border-primary/60 hover:text-primary hover:bg-primary/5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary/60 hover:text-secondary-foreground",
        link: "text-primary underline underline-offset-4 decoration-1 hover:decoration-2",
        hero: "bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-[0_1px_2px_hsl(220_30%_3%/0.3),0_8px_24px_-8px_hsl(var(--primary)/0.4)] hover:shadow-[0_1px_2px_hsl(220_30%_3%/0.3),0_10px_28px_-6px_hsl(var(--primary)/0.5)] hover:-translate-y-[1px] active:translate-y-0",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-[0_2px_8px_-2px_rgba(37,211,102,0.4)]",
        premium: "bg-transparent border border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
