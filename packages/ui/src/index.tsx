// Exporta el CSS para que Tailwind funcione en las apps
import './styles.css';

// Exporta utilidades
export { cn } from './lib/utils';

// Exporta componentes aquí
export * from './components/ui/button';
export * from './components/ui/dialog';
export * from './components/ui/input';
export * from './components/ui/label';
export * from './components/ui/avatar';
export * from './components/ui/dropdown-menu';
export * from './components/ui/separator';
export * from './components/ui/checkbox';
export * from './components/ui/textarea';
export * from './components/ui/card';
export * from './components/ui/badge';
export * from './components/ui/category-chip';
export * from './components/ui/store-card';
export * from './components/ui/tooltip';
export * from './components/ui/theme-toggle';
export * from './components/ui/sheet';
export * from './components/store/StoreStatusIndicator';
export * from './components/common/GlobalLoader';
export * from './components/navigation/BottomNavBar';
export * from './components/navigation/UserMenu';
export * from './components/address/AddressSelector';
export { ProductCard } from './components/ProductCard';
// export * from './components/ui/radio-group'; // Temporarily commented out due to TS2742 errors
export * from './components/ui/calendar';
// export * from './components/ui/time-picker'; // Temporarily commented out due to select.tsx dependency
// export * from './components/ui/select'; // Temporarily commented out due to TS2742 errors
// export * from './MyComponent'; // Ejemplo componente propio

/**
 * BACKUP OF select.tsx (temporarily removed due to TS2742 errors)
 * To be restored later when the type issues are fixed
 * 
 * Original location: packages/ui/src/components/ui/select.tsx
 * Removed on: [current_date]
 * 
 * @fileoverview
 * ```tsx
 * import * as React from 'react';
 * import * as SelectPrimitive from '@radix-ui/react-select';
 * import { Check, ChevronDown } from 'lucide-react';
 * 
 * import { cn } from '../../lib/utils';
 * 
 * const Select = SelectPrimitive.Root;
 * 
 * const SelectGroup = SelectPrimitive.Group;
 * 
 * const SelectValue = SelectPrimitive.Value;
 * 
 * const SelectTrigger = React.forwardRef<
 *   React.ElementRef<typeof SelectPrimitive.Trigger>,
 *   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
 * >(({ className, children, ...props }, ref) => (
 *   <SelectPrimitive.Trigger
 *     ref={ref}
 *     className={cn(
 *       'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
 *       className
 *     )}
 *     {...props}
 *   >
 *     {children}
 *     <SelectPrimitive.Icon asChild>
 *       <ChevronDown className="h-4 w-4 opacity-50" />
 *     </SelectPrimitive.Icon>
 *   </SelectPrimitive.Trigger>
 * ));
 * SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
 * 
 * const SelectContent = React.forwardRef<
 *   React.ElementRef<typeof SelectPrimitive.Content>,
 *   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
 * >(({ className, children, position = 'popper', ...props }, ref) => (
 *   <SelectPrimitive.Portal>
 *     <SelectPrimitive.Content
 *       ref={ref}
 *       className={cn(
 *         'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
 *         position === 'popper' &&
 *           'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
 *         className
 *       )}
 *       position={position}
 *       {...props}
 *     >
 *       <SelectPrimitive.Viewport
 *         className={cn(
 *           'p-1',
 *           position === 'popper' &&
 *             'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
 *         )}
 *       >
 *         {children}
 *       </SelectPrimitive.Viewport>
 *     </SelectPrimitive.Content>
 *   </SelectPrimitive.Portal>
 * ));
 * SelectContent.displayName = SelectPrimitive.Content.displayName;
 * 
 * const SelectLabel = React.forwardRef<
 *   React.ElementRef<typeof SelectPrimitive.Label>,
 *   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
 * >(({ className, ...props }, ref) => (
 *   <SelectPrimitive.Label
 *     ref={ref}
 *     className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
 *     {...props}
 *   />
 * ));
 * SelectLabel.displayName = SelectPrimitive.Label.displayName;
 * 
 * const SelectItem = React.forwardRef<
 *   React.ElementRef<typeof SelectPrimitive.Item>,
 *   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
 * >(({ className, children, ...props }, ref) => (
 *   <SelectPrimitive.Item
 *     ref={ref}
 *     className={cn(
 *       'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
 *       className
 *     )}
 *     {...props}
 *   >
 *     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
 *       <SelectPrimitive.ItemIndicator>
 *         <Check className="h-4 w-4" />
 *       </SelectPrimitive.ItemIndicator>
 *     </span>
 * 
 *     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
 *   </SelectPrimitive.Item>
 * ));
 * SelectItem.displayName = SelectPrimitive.Item.displayName;
 * 
 * const SelectSeparator = React.forwardRef<
 *   React.ElementRef<typeof SelectPrimitive.Separator>,
 *   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
 * >(({ className, ...props }, ref) => (
 *   <SelectPrimitive.Separator
 *     ref={ref}
 *     className={cn('-mx-1 my-1 h-px bg-muted', className)}
 *     {...props}
 *   />
 * ));
 * SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
 * 
 * export {
 *   Select,
 *   SelectGroup,
 *   SelectValue,
 *   SelectTrigger,
 *   SelectContent,
 *   SelectLabel,
 *   SelectItem,
 *   SelectSeparator,
 * };
 * ```
 */

/**
 * BACKUP OF time-picker.tsx (temporarily removed due to select.tsx dependency)
 * To be restored later when select component is fixed
 * 
 * Original location: packages/ui/src/components/ui/time-picker.tsx
 * Removed on: [current_date]
 * 
 * @fileoverview
 * ```tsx
 * import * as React from 'react';
 * import { Select } from './select';
 * import { Label } from './label';
 * 
 * interface TimePickerProps {
 *   value: string;
 *   onChange: (value: string) => void;
 *   className?: string;
 *   label?: string;
 *   minTime?: string;
 *   maxTime?: string;
 *   interval?: number;
 * }
 * 
 * export function TimePicker({
 *   value,
 *   onChange,
 *   className,
 *   label,
 *   minTime = '00:00',
 *   maxTime = '23:59',
 *   interval = 30,
 * }: TimePickerProps) {
 *   const timeOptions = React.useMemo(() => {
 *     const options: string[] = [];
 *     const [minHour, minMinute] = minTime.split(':').map(Number);
 *     const [maxHour, maxMinute] = maxTime.split(':').map(Number);
 *     const minMinutes = minHour * 60 + minMinute;
 *     const maxMinutes = maxHour * 60 + maxMinute;
 * 
 *     for (let minutes = minMinutes; minutes <= maxMinutes; minutes += interval) {
 *       const hour = Math.floor(minutes / 60);
 *       const minute = minutes % 60;
 *       const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
 *       options.push(time);
 *     }
 * 
 *     return options;
 *   }, [minTime, maxTime, interval]);
 * 
 *   return (
 *     <div className="space-y-2">
 *       {label && <Label>{label}</Label>}
 *       <Select value={value} onValueChange={onChange}>
 *         {timeOptions.map((time) => (
 *           <option key={time} value={time}>
 *             {time}
 *           </option>
 *         ))}
 *       </Select>
 *     </div>
 *   );
 * }
 * ```
 */
