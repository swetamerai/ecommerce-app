import { useState } from "react";
import { useRoute, Link } from "wouter";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { useGetProduct, useAddToCart } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCartSessionId } from "@/lib/cart-session";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const [quantity, setQuantity] = useState(1);
  const sessionId = getCartSessionId();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id }
  });

  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart.mutate(
      { data: { sessionId, productId: product.id, quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
          toast.success(`Added ${quantity} ${product.name} to cart`);
        },
        onError: () => {
          toast.error("Failed to add to cart");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="max-w-6xl mx-auto py-8">
          <Skeleton className="w-24 h-6 mb-8" />
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-6 pt-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-14 w-full rounded-full" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="max-w-6xl mx-auto py-24 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">Return to store</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors" data-testid="link-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-100/50">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No Image Available</div>
            )}
            {!product.isActive && (
              <div className="absolute top-4 left-4 bg-black/80 text-white text-sm font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm">
                Out of Stock
              </div>
            )}
          </div>

          <div className="flex flex-col pt-2 md:pt-8">
            <p className="text-primary font-medium tracking-wide text-sm mb-2">{product.categoryName}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-gray-900 mb-8">{formatCurrency(product.price)}</p>
            
            <div className="prose text-gray-600 mb-10">
              <p>{product.description || "No description available."}</p>
            </div>

            <div className="mt-auto space-y-6">
              {product.isActive ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-100 rounded-full border p-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full hover:bg-white transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="btn-decrease-qty"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium tabular-nums" data-testid="text-qty">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full hover:bg-white transition-colors"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      data-testid="btn-increase-qty"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">{product.stock} in stock</p>
                </div>
              ) : null}

              <Button 
                size="lg" 
                className="w-full h-14 rounded-full text-base font-semibold shadow-md active:scale-[0.98] transition-transform"
                disabled={!product.isActive || addToCart.isPending}
                onClick={handleAddToCart}
                data-testid="btn-add-to-cart-large"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
