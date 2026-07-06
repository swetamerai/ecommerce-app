import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  useListOrders, 
  useGetOrder,
  useUpdateOrderStatus,
  getListOrdersQueryKey,
  getGetOrderQueryKey
} from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading } = useListOrders(
    statusFilter !== "all" ? { status: statusFilter as any } : {}
  );
  
  const { data: orderDetails, isLoading: isLoadingDetails } = useGetOrder(selectedOrderId!, {
    query: { enabled: !!selectedOrderId }
  });

  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate(
      { id, data: { status: status as any } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          if (selectedOrderId === id) {
            queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(id) });
          }
          toast.success("Order status updated");
        },
        onError: () => toast.error("Failed to update status")
      }
    );
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500">Manage customer orders and fulfillment</p>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : orders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders?.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900">
                        #{order.id.toString().padStart(5, '0')}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrderId(order.id)}
                          data-testid={`btn-view-order-${order.id}`}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order Details</span>
                {orderDetails && (
                  <span className="font-mono text-gray-500 text-sm font-normal">
                    #{orderDetails.id.toString().padStart(5, '0')}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            {isLoadingDetails || !orderDetails ? (
              <div className="py-8 space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer</h3>
                    <p className="font-medium text-gray-900">{orderDetails.customerName}</p>
                    <p className="text-sm text-gray-600">{orderDetails.customerEmail}</p>
                    {orderDetails.customerPhone && <p className="text-sm text-gray-600">{orderDetails.customerPhone}</p>}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{orderDetails.address}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Order Items</h3>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-medium text-gray-500">Item</th>
                          <th className="px-4 py-3 font-medium text-gray-500 text-center">Qty</th>
                          <th className="px-4 py-3 font-medium text-gray-500 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orderDetails.items?.map((item: any) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-gray-900">{item.productName}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t font-bold">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-right text-gray-900">Total</td>
                          <td className="px-4 py-3 text-right text-primary text-lg">{formatCurrency(orderDetails.total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Update Status:</span>
                    <Select 
                      value={orderDetails.status} 
                      onValueChange={(val) => handleStatusChange(orderDetails.id, val)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" onClick={() => setSelectedOrderId(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
