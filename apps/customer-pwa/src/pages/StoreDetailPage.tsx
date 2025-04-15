import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStoreDetailsById, getAvailableProductsForStore, type StoreDetails, type Product } from '@repo/api-client';
import { useSupabase } from '@/providers/SupabaseProvider';
import { StoreHeader } from '@/components/store/StoreHeader';
import { ProductCard } from '@repo/ui';

export default function StoreDetailPage() {
  const { storeId } = useParams();
  const supabase = useSupabase();

  const {
    data: storeDetails,
    isLoading: isLoadingStore,
    isError: isStoreError,
    error: storeError,
  } = useQuery<StoreDetails | null>({
    queryKey: ['storeDetails', storeId],
    queryFn: () => getStoreDetailsById(supabase, storeId!),
    enabled: !!storeId,
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError,
  } = useQuery<Product[]>({
    queryKey: ['storeProducts', storeId],
    queryFn: () => getAvailableProductsForStore(supabase, storeId!),
    enabled: !!storeId,
  });

  const isLoading = isLoadingStore || isLoadingProducts;
  const isError = isStoreError || isProductsError;
  const error = storeError || productsError;

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

  if (isError && error) {
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
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} storeId={storeId!} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
