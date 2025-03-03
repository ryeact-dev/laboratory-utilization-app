import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/10",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/10",
        secondaryFaded:
          "border-none bg-secondary/10 font-normal text-secondary hover:bg-secondary/10",
        success:
          "border-none bg-green-500/10 font-normal text-green-500 hover:bg-green-500/10 px-2 py-0 rounded-full",
        error:
          "border-none bg-red-800/20 font-normal text-red-500 hover:bg-red-800/20 px-2 py-0 rounded-full",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
