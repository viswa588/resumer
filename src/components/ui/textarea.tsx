import * as React from "react";
import { cn } from "../../lib/utils"

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
