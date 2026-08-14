import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui 표준 Button. `default`/`accent` variant는 이 앱의 버건디 팔레트
 * (accent-deep/accent-press, tailwind.config.js 참고)를 사용합니다.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold font-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-accent-deep text-white shadow-sm hover:bg-accent-press",
        accent: "bg-accent-deep text-white shadow-sm hover:bg-accent-press",
        outline:
          "border border-border bg-bg text-fg hover:bg-surface",
        secondary: "bg-surface text-fg hover:bg-border/60",
        ghost: "text-fg hover:bg-surface",
        link: "text-accent-deep underline-offset-4 hover:underline",
        destructive: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-[54px] px-7 text-[15.5px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
