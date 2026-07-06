import { useState, useMemo } from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  
  const { data: products, isLoading: isLoadingProducts } = useListProducts({ category, search });
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="text-center py-12 md:py-24 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl mx-auto leading-tight">
            Curated Essentials for <span className="text-primary">Modern Living</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of premium products designed to elevate your everyday experience. Free shipping on all orders.
          </p>
          <div className="flex justify-center max-w-md mx-auto pt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="pl-12 h-14 rounded-full text-base bg-white shadow-sm border-gray-200 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={!category ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCategory(undefined)}
              data-testid="btn-category-all"
            >
              All
            </Button>
            {isLoadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))
            ) : (
              categories?.map((c) => (
                <Button
                  key={c.id}
                  variant={category === c.slug ? "default" : "outline"}
                  className="rounded-full bg-white"
                  onClick={() => setCategory(c.slug)}
                  data-testid={`btn-category-${c.slug}`}
                >
                  {c.name}
                </Button>
              ))
            )}
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] rounded-2xl w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </StoreLayout>
  );
}
