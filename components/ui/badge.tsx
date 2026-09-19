import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gold/20 text-gold hover:bg-gold/30",
        secondary: "border-transparent bg-onyx-line text-parchment hover:bg-onyx-line/80",
        active: "border-gold/40 bg-gold/10 text-gold",
        inactive: "border-parchment-muted/40 bg-parchment-muted/10 text-parchment-muted",
        suspended: "border-maroon/50 bg-maroon/15 text-maroon-light",
        honorary: "border-gold/60 bg-gold/20 text-gold-light",
        life_member: "border-gold/60 bg-gold/20 text-gold-light",
        pending: "border-parchment-muted/40 bg-parchment-muted/10 text-parchment-muted",
        approved: "border-gold/40 bg-gold/10 text-gold",
        rejected: "border-maroon/50 bg-maroon/15 text-maroon-light",
      },
    },
    defaultVariants: { variant: "active" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
