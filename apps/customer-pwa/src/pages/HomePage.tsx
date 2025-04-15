import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { getProductCategories, getStoresForHome, ProductCategoryType, Store } from '@repo/api-client';
import { CategoryChip } from '@repo/ui/components/ui/category-chip';
import { StoreCard } from '@repo/ui/components/ui/store-card';
import { Input } from '@repo/ui/components/ui/input';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAddressStore } from '@/store/addressStore';
import { StoreStatusIndicator } from '@/components/store/StoreStatusIndicator';
import { useTranslation } from 'react-i18next';

// Skeleton Loader Components
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} />
);
const CategoryChipSkeleton: React.FC = () => <Skeleton className="h-8 w-24 rounded-full" />;
const StoreCardSkeleton: React.FC = () => <Skeleton className="h-[260px] w-[280px]" />;

export const HomePage: React.FC = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const { activeAddress, isLoading: isLoadingAddressStore } = useAddressStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { t } = useTranslation();

  // Get the active postal code
  const activePostalCode = activeAddress?.postal_code;

  // --- Data Fetching ---
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<ProductCategoryType[]>({
    queryKey: ['productCategories'],
    queryFn: () => getProductCategories(supabase),
    enabled: !!activePostalCode && !isLoadingAddressStore,
  });

  const { data: stores = [], isLoading: isLoadingStores } = useQuery<Store[]>({
    queryKey: ['storesHome', selectedCategoryId, activePostalCode],
    queryFn: () =>
      getStoresForHome(supabase, {
        postalCode: activePostalCode,
        categoryId: selectedCategoryId,
      }),
    enabled: !!activePostalCode && !isLoadingAddressStore,
  });

  // --- Event Handlers ---
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  // --- Loading States ---
  const isLoading = isLoadingAddressStore || isLoadingCategories || isLoadingStores;

  // --- Render Logic ---
  if (isLoadingAddressStore && !activeAddress) {
    return <div className="text-center text-muted-foreground">Loading location...</div>;
  }

  if (!activeAddress && !isLoadingAddressStore) {
    return (
      <div className="text-center text-muted-foreground">
        Please select or add a delivery address to see stores.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saludo */}
      {user && (
        <h2 className="text-2xl font-bold">{t('common.hi')} {user.user_metadata?.full_name || ''} 👋</h2>
      )}

      {/* Barra de Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder={t('common.search')} className="pl-10" />
      </div>

      {/* Scroll Horizontal Categorías */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-2 whitespace-nowrap">
          {isLoadingCategories ? (
            Array.from({ length: 5 }).map((_, i) => <CategoryChipSkeleton key={i} />)
          ) : (
            <>
              <CategoryChip
                selected={selectedCategoryId === null}
                onClick={() => handleCategoryClick(null)}
              >
                {t('store.list.all')}
              </CategoryChip>
              {categories.map(category => (
                <CategoryChip
                  key={category.id}
                  selected={selectedCategoryId === category.id}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </CategoryChip>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Status Indicators Legend */}
      <div className="flex items-center gap-6 px-4">
        <StoreStatusIndicator status="open" showLabel />
        <StoreStatusIndicator status="scheduled" showLabel />
        <StoreStatusIndicator status="closed" showLabel />
      </div>

      {/* Secciones Verticales */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">
          {selectedCategoryId
            ? `${categories.find(c => c.id === selectedCategoryId)?.name} ${t('store.list.near')} ${activePostalCode}`
            : `${t('store.list.near')} ${activePostalCode}`}
        </h3>

        {/* Grid de Tiendas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <StoreCardSkeleton key={i} />)
          ) : stores.length === 0 ? (
            <p className="text-muted-foreground">
              {t('store.list.noStores')} {activePostalCode}
              {selectedCategoryId &&
                ` ${t('store.list.inCategory')} ${categories.find(c => c.id === selectedCategoryId)?.name}`}
              .
            </p>
          ) : (
            stores.map(store => (
              <Link key={store.id} to={`store/${store.id}`}>
                <StoreCard store={store} className="w-full" />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
