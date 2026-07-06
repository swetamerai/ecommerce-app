import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { getCartSessionId } from "@/lib/cart-session";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const sessionId = getCartSessionId();
  const { data: cartItems } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Package2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline-block">LuxeStore</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors" data-testid="link-nav-shop">Shop</Link>
              <Link href="/admin" className="hover:text-primary transition-colors" data-testid="link-nav-admin">Admin</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/cart" className="relative group" data-testid="link-cart">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full" data-testid="btn-mobile-menu">
              <Menu className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t bg-white py-12 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
