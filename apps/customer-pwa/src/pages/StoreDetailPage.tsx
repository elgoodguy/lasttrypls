import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStoreDetailsById, type StoreDetails } from '@repo/api-client';
import { useSupabase } from '@/providers/SupabaseProvider';
import { StoreHeader } from '@/components/store/StoreHeader';

export default function StoreDetailPage() {
  const { storeId } = useParams();
  const supabase = useSupabase();

  const {
    data: storeDetails,
    isLoading,
    isError,
    error,
  } = useQuery<StoreDetails | null>({
    queryKey: ['storeDetails', storeId],
    queryFn: () => getStoreDetailsById(supabase, storeId!),
    enabled: !!storeId,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-48 w-full bg-muted" />
        {/* Content Skeleton */}
        <div className="p-4">
          <div className="h-8 w-48 bg-muted rounded-md" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-32 bg-muted rounded-md" />
            <div className="h-4 w-64 bg-muted rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>Error al cargar los detalles de la tienda:</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!storeDetails) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Tienda no encontrada</p>
      </div>
    );
  }

  return (
    <div>
      <StoreHeader store={storeDetails} />
    </div>
  );
}
