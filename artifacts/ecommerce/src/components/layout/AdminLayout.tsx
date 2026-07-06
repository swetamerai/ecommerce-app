import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, Store, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex bg-gray-100">
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight" data-testid="link-admin-home">
            <span className="bg-gray-900 text-white p-1.5 rounded-md text-xs">AD</span>
            <span>Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              data-testid={`link-admin-nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors" data-testid="link-admin-back-store">
            <Store className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-white md:hidden">
          <span className="font-bold text-lg">Admin Panel</span>
          <Button variant="ghost" size="icon" data-testid="btn-admin-mobile-menu">
            <Menu className="w-5 h-5" />
          </Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
