import * as React from "react";
import { cn } from "../../lib/utils";

export const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));

Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <img ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));

AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = ({ className, children }) => (
  <div className={cn("flex h-full w-full items-center justify-center bg-gray-200 text-gray-500", className)}>
    {children}
  </div>
);

AvatarFallback.displayName = "AvatarFallback";
