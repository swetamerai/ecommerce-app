import { Router } from "express";
import { sql, eq } from "drizzle-orm";
import { db, productsTable, ordersTable, categoriesTable } from "@workspace/db";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";

const router = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const [productCount] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(productsTable);
  const [orderCount] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(ordersTable);
  const [revenue] = await db.select({ total: sql<number>`coalesce(cast(sum(total) as float), 0)` }).from(ordersTable);
  const [catCount] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(categoriesTable);
  const [pendingCount] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));

  const recentOrders = await db
    .select()
    .from(ordersTable)
    .orderBy(ordersTable.createdAt)
    .limit(5);

  res.json(
    GetDashboardSummaryResponse.parse({
      totalProducts: productCount?.count ?? 0,
      totalOrders: orderCount?.count ?? 0,
      totalRevenue: revenue?.total ?? 0,
      totalCategories: catCount?.count ?? 0,
      pendingOrders: pendingCount?.count ?? 0,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        total: parseFloat(o.total),
        createdAt: o.createdAt.toISOString(),
      })),
    }),
  );
});

export default router;
