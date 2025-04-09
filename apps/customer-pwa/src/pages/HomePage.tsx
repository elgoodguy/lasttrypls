import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { getProductCategories, getStoresForHome, ProductCategory, Store } from '@repo/api-client';
import { CategoryChip } from '@repo/ui';
import { StoreCard } from '@repo/ui';
import { Input } from '@repo/ui';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Skeleton Loader Components
const Skeleton: React.FC<{ className?: string }> = ({ className }) => <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
const CategoryChipSkeleton: React.FC = () => <Skeleton className="h-8 w-24 rounded-full" />;
const StoreCardSkeleton: React.FC = () => <Skeleton className="h-[260px] w-[280px]" />;

export const HomePage: React.FC = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // --- Data Fetching ---
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<ProductCategory[]>({
    queryKey: ['productCategories'],
    queryFn: () => getProductCategories(supabase),
  });

  const { data: stores = [], isLoading: isLoadingStores } = useQuery<Store[]>({
    queryKey: ['storesHome', selectedCategoryId],
    queryFn: () => getStoresForHome(supabase),
  });

  // --- Event Handlers ---
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Saludo */}
      {user && <h2 className="text-2xl font-bold">Hi, {user.user_metadata?.full_name || 'there'}! 👋</h2>}

      {/* Barra de Búsqueda (Placeholder) */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search stores or products..."
          className="pl-10"
        />
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
                        All
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

      {/* Secciones Verticales */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">
            {selectedCategoryId ? categories.find(c=>c.id === selectedCategoryId)?.name : 'Featured Stores'}
        </h3>

         {/* Scroll Horizontal Tiendas */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
           <div className="flex space-x-4">
            {isLoadingStores ? (
                 Array.from({ length: 3 }).map((_, i) => <StoreCardSkeleton key={i} />)
            ) : stores.length === 0 ? (
                 <p className="text-muted-foreground">No stores found matching your criteria.</p>
            ) : (
                stores.map(store => (
                     <Link key={store.id} to={`/store/${store.id}`} className="block flex-shrink-0">
                        <StoreCard store={store} />
                     </Link>
                ))
            )}
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 