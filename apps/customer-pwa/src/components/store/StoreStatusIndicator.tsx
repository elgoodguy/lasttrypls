import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const statusConfig = {
    open: { color: 'bg-success', label: t('store.status.open') },
    scheduled: { color: 'bg-warning', label: t('store.status.schedule') },
    closed: { color: 'bg-destructive', label: t('store.status.closed') },
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
