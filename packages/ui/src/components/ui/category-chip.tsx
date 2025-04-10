import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const categoryChipVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
      size: {
        default: 'h-8 px-4 py-1', // Adjust size as needed
        sm: 'h-7 rounded-full px-3',
        lg: 'h-9 rounded-full px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface CategoryChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, // Use Button attributes
    VariantProps<typeof categoryChipVariants> {
  asChild?: boolean;
  selected?: boolean; // Add selected prop
}

const CategoryChip = React.forwardRef<HTMLButtonElement, CategoryChipProps>(
  ({ className, variant, size, selected, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'; // Render as button by default
    return (
      <Comp
        className={cn(
          categoryChipVariants({ variant: selected ? 'selected' : variant, size, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
CategoryChip.displayName = 'CategoryChip';

export { CategoryChip, categoryChipVariants };
