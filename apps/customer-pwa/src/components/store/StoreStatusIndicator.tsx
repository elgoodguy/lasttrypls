import { cn } from '@/lib/utils';

type StoreStatus = 'open' | 'scheduled' | 'closed';

interface StoreStatusIndicatorProps {
  status: StoreStatus;
  showLabel?: boolean;
  className?: string;
}

export function StoreStatusIndicator({
  status,
  showLabel = false,
  className,
}: StoreStatusIndicatorProps) {
  const statusConfig = {
    open: { color: 'bg-success', label: 'Abierto' },
    scheduled: { color: 'bg-warning', label: 'Programar' },
    closed: { color: 'bg-destructive', label: 'Cerrado' },
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('h-2.5 w-2.5 rounded-full', statusConfig[status].color)} />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{statusConfig[status].label}</span>
      )}
    </div>
  );
}
