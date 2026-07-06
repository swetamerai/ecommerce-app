import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@workspace/api-client-react";
import { getCartSessionId } from "@/lib/cart-session";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useRef } from "react";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const sessionId = getCartSessionId();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate(
      { data: { sessionId, productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
          toast.success(`${product.name} added to cart`);
        },
        onError: () => {
          toast.error("Failed to add to cart");
        }
      }
    );
  };

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col gap-3" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-2">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">No Image</div>
        )}
        {!product.isActive && (
          <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-md">
            Out of Stock
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        <Button 
          size="icon" 
          variant="secondary"
          className="absolute bottom-4 right-4 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm"
          onClick={handleAddToCart}
          disabled={!product.isActive || addToCart.isPending}
          data-testid={`btn-add-cart-${product.id}`}
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-1">{product.categoryName}</p>
        <p className="font-bold text-primary">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  );
}
