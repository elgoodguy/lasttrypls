import * as React from "react";
import { cn } from "../../lib/utils";

export interface GlobalLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const GlobalLoader = React.forwardRef<HTMLDivElement, GlobalLoaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50",
          className
        )}
        {...props}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
);

GlobalLoader.displayName = "GlobalLoader";

export { GlobalLoader }; 