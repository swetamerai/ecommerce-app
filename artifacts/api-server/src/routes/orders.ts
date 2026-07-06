import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, cartItemsTable, productsTable } from "@workspace/db";
import {
  CreateOrderBody,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
  GetOrderParams,
  ListOrdersQueryParams,
  ListOrdersResponse,
  CreateOrderResponse,
  GetOrderResponse,
  UpdateOrderStatusResponse,
} from "@workspace/api-zod";

const router = Router();

function formatOrder(o: typeof ordersTable.$inferSelect) {
  return {
    ...o,
    total: parseFloat(o.total),
    createdAt: o.createdAt.toISOString(),
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { status, page = 1 } = parsed.data;

  let query = db.select().from(ordersTable).$dynamic();
  if (status) {
    query = query.where(eq(ordersTable.status, status as "pending" | "processing" | "shipped" | "delivered" | "cancelled"));
  }

  const orders = await query.limit(20).offset((page - 1) * 20).orderBy(ordersTable.createdAt);
  res.json(ListOrdersResponse.parse(orders.map(formatOrder)));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { sessionId, customerName, customerEmail, customerPhone, address } = parsed.data;

  // Get cart items
  const cartItems = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, sessionId));

  if (cartItems.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  // Get product prices
  let total = 0;
  const orderItemsData: { productId: number; productName: string; price: string; quantity: number }[] = [];

  for (const ci of cartItems) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, ci.productId));
    if (product) {
      const price = parseFloat(product.price);
      total += price * ci.quantity;
      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: ci.quantity,
      });
    }
  }

  // Create order
  const [order] = await db
    .insert(ordersTable)
    .values({ customerName, customerEmail, customerPhone, address, total: String(total) })
    .returning();

  // Create order items
  for (const item of orderItemsData) {
    await db.insert(orderItemsTable).values({ orderId: order.id, ...item });
  }

  // Clear cart
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

  res.status(201).json(CreateOrderResponse.parse(formatOrder(order)));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetOrderParams.safeParse({ id: parseInt(rawId, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, parsed.data.id));
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));

  res.json(
    GetOrderResponse.parse({
      ...formatOrder(order),
      items: items.map((i) => ({ ...i, price: parseFloat(i.price) })),
    }),
  );
});

router.patch("/orders/:id/status", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramParsed = UpdateOrderStatusParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: bodyParsed.data.status })
    .where(eq(ordersTable.id, paramParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(UpdateOrderStatusResponse.parse(formatOrder(updated)));
});

export default router;
