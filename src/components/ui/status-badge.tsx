import { cn } from "@/lib/utils";
import { PRState } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  state: PRState;
  className?: string;
}

const statusConfig = {
  DRAFT: {
    label: "Draft",
    variant: "secondary" as const,
    className: "bg-status-draft text-white"
  },
  SUBMITTED: {
    label: "Submitted",
    variant: "default" as const,
    className: "bg-status-submitted text-white"
  },
  DM_APPROVED: {
    label: "Manager Approved",
    variant: "default" as const,
    className: "bg-primary text-primary-foreground"
  },
  DM_REJECTED: {
    label: "Manager Rejected",
    variant: "destructive" as const,
    className: "bg-status-rejected text-white"
  },
  ACCT_APPROVED: {
    label: "Accounting Approved",
    variant: "default" as const,
    className: "bg-warning text-warning-foreground"
  },
  ACCT_REJECTED: {
    label: "Accounting Rejected",
    variant: "destructive" as const,
    className: "bg-status-rejected text-white"
  },
  FINAL_APPROVED: {
    label: "Final Approved",
    variant: "default" as const,
    className: "bg-success text-success-foreground"
  },
  FINAL_REJECTED: {
    label: "Final Rejected",
    variant: "destructive" as const,
    className: "bg-status-rejected text-white"
  },
  FUNDS_TRANSFERRED: {
    label: "Funds Transferred",
    variant: "default" as const,
    className: "bg-status-transferred text-white font-semibold"
  }
};

export function StatusBadge({ state, className }: StatusBadgeProps) {
  const config = statusConfig[state];
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(
        config.className,
        "transition-fast hover:scale-105",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}