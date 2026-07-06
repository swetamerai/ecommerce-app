import { useState } from "react";
import { Link, useLocation } from "wouter";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { useGetCart, useUpdateCartItem, useRemoveCartItem, useCreateOrder, getGetCartQueryKey, useClearCart } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCartSessionId } from "@/lib/cart-session";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone is required"),
  address: z.string().min(5, "Full address is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Cart() {
  const sessionId = getCartSessionId();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: cartItems, isLoading } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
    },
  });

  const subtotal = cartItems?.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0) || 0;

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateItem.mutate(
      { id, data: { quantity } },
      {
        onSuccess: () => {
          queryClient.setQueryData(getGetCartQueryKey({ sessionId }), (old: any) => 
            old?.map((item: any) => item.id === id ? { ...item, quantity } : item)
          );
        }
      }
    );
  };

  const handleRemove = (id: number) => {
    removeItem.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.setQueryData(getGetCartQueryKey({ sessionId }), (old: any) => 
            old?.filter((item: any) => item.id !== id)
          );
          toast.success("Item removed");
        }
      }
    );
  };

  const onSubmit = (data: CheckoutFormValues) => {
    if (!cartItems?.length) return;

    createOrder.mutate(
      { data: { ...data, sessionId } },
      {
        onSuccess: (order) => {
          toast.success("Order placed successfully!");
          clearCart.mutate({ params: { sessionId } }, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
              setLocation(`/order-success?id=${order.id}`);
            }
          });
        },
        onError: () => {
          toast.error("Failed to place order. Please try again.");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="max-w-5xl mx-auto py-8">
          <Skeleton className="w-48 h-10 mb-8" />
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
            </div>
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!cartItems?.length) {
    return (
      <StoreLayout>
        <div className="max-w-md mx-auto py-24 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 sm:gap-6 bg-white p-4 rounded-2xl border shadow-sm">
                <Link href={`/product/${item.productId}`} className="shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden">
                    {item.product?.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>
                </Link>
                
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        <Link href={`/product/${item.productId}`} className="hover:text-primary transition-colors">
                          {item.product?.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.product?.categoryName}</p>
                    </div>
                    <p className="font-bold text-gray-900">{formatCurrency(item.product?.price || 0)}</p>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-center bg-gray-50 rounded-full p-1 border">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updateItem.isPending}
                        data-testid={`btn-dec-cart-${item.id}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updateItem.isPending || (item.product?.stock ? item.quantity >= item.product.stock : false)}
                        data-testid={`btn-inc-cart-${item.id}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => handleRemove(item.id)}
                      disabled={removeItem.isPending}
                      data-testid={`btn-remove-cart-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 text-white sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 border-b border-gray-800 pb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold">{formatCurrency(subtotal)}</span>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Full Name" className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Email" type="email" className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Phone" className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Shipping Address" className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl resize-none" rows={3} {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground mt-4 group"
                    disabled={createOrder.isPending}
                    data-testid="btn-checkout"
                  >
                    {createOrder.isPending ? "Processing..." : "Place Order"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
