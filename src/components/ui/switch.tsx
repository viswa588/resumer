import { cn } from "../../lib/utils"
import * as React from "react";


export const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full border transition",
      "bg-gray-300 data-[state=checked]:bg-blue-500"
    )}
    {...props}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 transform rounded-full bg-white transition",
        "translate-x-1 data-[state=checked]:translate-x-6"
      )}
    />
  </button>
));

Switch.displayName = "Switch";
