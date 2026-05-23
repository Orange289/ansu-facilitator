import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-background shadow-[0_14px_34px_rgba(43,42,38,0.10)] hover:bg-ink/86 hover:shadow-[0_18px_42px_rgba(43,42,38,0.14)]",
        outline:
          "border border-ink/30 bg-transparent text-ink hover:border-line hover:bg-line/12",
        ghost: "text-ink hover:bg-line/10"
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export {Button, buttonVariants};
