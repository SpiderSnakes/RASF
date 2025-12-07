// =============================================================================
// Composant Card
// =============================================================================

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-white border border-gray-200",
      bordered: "bg-white border-2 border-gray-300",
      elevated: "bg-white shadow-lg",
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl p-6 ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = "", children, ...props }, ref) => (
  <div ref={ref} className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className = "", children, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = "", children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));

CardContent.displayName = "CardContent";

