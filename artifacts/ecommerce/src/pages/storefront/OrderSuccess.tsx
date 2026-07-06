import { Link, useSearch } from "wouter";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function OrderSuccess() {
  const searchParams = new URLSearchParams(useSearch());
  const orderId = searchParams.get("id");

  return (
    <StoreLayout>
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Order Confirmed!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for shopping with us. Your order has been received and is currently being processed.
        </p>

        {orderId && (
          <div className="bg-gray-50 p-6 rounded-2xl border mb-8 inline-block w-full">
            <p className="text-sm text-gray-500 mb-1">Order Reference ID</p>
            <p className="font-mono text-xl font-bold text-gray-900">#{orderId.padStart(6, '0')}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full font-semibold">
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </StoreLayout>
  );
}
