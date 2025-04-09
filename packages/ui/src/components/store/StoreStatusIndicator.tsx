import * as React from "react"
import { cn } from "../../lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"

interface StoreStatusIndicatorProps {
  isActive: boolean
  className?: string
}

export function StoreStatusIndicator({ isActive, className }: StoreStatusIndicatorProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              isActive ? "bg-green-500" : "bg-red-500",
              className
            )}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{isActive ? "Store is open" : "Store is closed"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 