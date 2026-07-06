import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      title: "Orders",
      value: summary?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Products",
      value: summary?.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Pending Orders",
      value: summary?.pendingOrders || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back. Here's what's happening with your store today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {summary?.recentOrders && summary.recentOrders.length > 0 ? (
              <div className="divide-y">
                {summary.recentOrders.map(order => (
                  <div key={order.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                      <span className="font-mono font-medium text-gray-900">#{order.id.toString().padStart(5, '0')}</span>
                      <span className="text-sm text-gray-500">{order.customerName}</span>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize bg-gray-100 text-gray-800">
                        {order.status}
                      </span>
                    </div>
                    <div className="font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">No recent orders found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
