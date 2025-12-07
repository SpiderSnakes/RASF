// =============================================================================
// Composant Badge
// =============================================================================

import { HTMLAttributes, forwardRef } from "react";
import { ConsumptionMode, ReservationStatus } from "@prisma/client";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "surplace"
  | "emporter";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  surplace: "bg-blue-100 text-blue-800",
  emporter: "bg-amber-100 text-amber-800",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full 
          text-xs font-medium
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// =============================================================================
// Badges spécifiques
// =============================================================================

interface ConsumptionBadgeProps {
  mode: ConsumptionMode;
}

export function ConsumptionBadge({ mode }: ConsumptionBadgeProps) {
  if (mode === "SUR_PLACE") {
    return (
      <Badge variant="surplace">
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        Sur place
      </Badge>
    );
  }

  return (
    <Badge variant="emporter">
      <svg
        className="w-3 h-3 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      À emporter
    </Badge>
  );
}

interface StatusBadgeProps {
  status: ReservationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<ReservationStatus, { variant: BadgeVariant; label: string }> = {
    BOOKED: { variant: "success", label: "Réservé" },
    SERVED: { variant: "info", label: "Servi" },
    NO_SHOW: { variant: "danger", label: "Non venu" },
  };

  const { variant, label } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}

