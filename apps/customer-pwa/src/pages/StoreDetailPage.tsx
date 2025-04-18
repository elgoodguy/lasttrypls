import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product, StoreDetails, getStoreDetailsById, getAvailableProductsForStore, getProductDetailsById, ProductWithModifiers } from '@repo/api-client';
import { ProductCard } from '@repo/ui';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useQuery } from '@tanstack/react-query';
import { ProductDetailModal } from '@/components/product/ProductDetailModal';

export default function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  console.log('[StoreDetailPage] storeId from useParams:', storeId);

  const supabase = useSupabase();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data: store, isLoading: isLoadingStore, error: storeError } = useQuery<StoreDetails | null>({
    queryKey: ['storeDetails', storeId],
    queryFn: () => {
      console.log(`[StoreDetailPage] queryFn for storeDetails executing with storeId: ${storeId}`);
      if (!storeId) return null;
      return getStoreDetailsById(supabase, storeId);
    },
    enabled: !!storeId,
  });

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ['storeProducts', storeId],
    queryFn: () => getAvailableProductsForStore(supabase, storeId!),
    enabled: !!storeId,
  });

  const { 
    data: productDetails, 
    isLoading: isLoadingProductDetails,
    error: productDetailsError,
  } = useQuery<ProductWithModifiers | null>({
    queryKey: ['productDetails', selectedProductId],
    queryFn: async () => {
      console.log(`[StoreDetailPage] queryFn for productDetails executing with selectedProductId: ${selectedProductId}`);
      if (!selectedProductId) return null;
      return getProductDetailsById(supabase, selectedProductId);
    },
    enabled: !!selectedProductId,
  });

  const handleProductClick = (product: Product) => {
    console.log(`[StoreDetailPage] Product clicked: ${product.id}`);
    setSelectedProductId(product.id);
  };

  const handleCloseModal = () => {
    console.log('[StoreDetailPage] Closing modal.');
    setSelectedProductId(null);
  };

  if (isLoadingStore || isLoadingProducts) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (storeError) {
    return <div className="container mx-auto px-4 py-8">Error loading store: {storeError.message}</div>;
  }

  if (productsError) {
    return <div className="container mx-auto px-4 py-8">Error loading products: {productsError.message}</div>;
  }

  if (!store) {
    return <div className="container mx-auto px-4 py-8">Store not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{store.name}</h1>
      
      <h2 className="text-2xl font-semibold mb-4">Available Products</h2>
      {!products || products.length === 0 ? (
        <p className="text-muted-foreground">No products available for this store.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeId={storeId!}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      )}

      {/* Modal Logic */}
      <ProductDetailModal
        isOpen={!!selectedProductId && !productDetailsError}
        onClose={handleCloseModal}
        product={productDetails || undefined}
        storeId={storeId!}
        isLoading={isLoadingProductDetails}
      />
    </div>
  );
}
