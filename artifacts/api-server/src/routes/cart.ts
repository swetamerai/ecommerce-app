import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartItemsTable, productsTable, categoriesTable } from "@workspace/db";
import {
  AddToCartBody,
  UpdateCartItemBody,
  UpdateCartItemParams,
  RemoveCartItemParams,
  GetCartQueryParams,
  ClearCartQueryParams,
  GetCartResponse,
  AddToCartResponse,
  UpdateCartItemResponse,
} from "@workspace/api-zod";

const router = Router();

async function buildCartItemWithProduct(item: typeof cartItemsTable.$inferSelect) {
  const rows = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      stock: productsTable.stock,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      imageUrl: productsTable.imageUrl,
      isActive: productsTable.isActive,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, item.productId));

  const p = rows[0];
  return {
    ...item,
    product: p
      ? { ...p, price: parseFloat(p.price), createdAt: p.createdAt.toISOString() }
      : undefined,
  };
}

router.get("/cart", async (req, res): Promise<void> => {
  const parsed = GetCartQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, parsed.data.sessionId));

  const withProducts = await Promise.all(items.map(buildCartItemWithProduct));
  res.json(GetCartResponse.parse(withProducts));
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { sessionId, productId, quantity } = parsed.data;

  // If item already in cart, update quantity
  const existing = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));

  let item;
  if (existing[0]) {
    const [updated] = await db
      .update(cartItemsTable)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItemsTable.id, existing[0].id))
      .returning();
    item = updated;
  } else {
    const [inserted] = await db
      .insert(cartItemsTable)
      .values({ sessionId, productId, quantity })
      .returning();
    item = inserted;
  }

  const withProduct = await buildCartItemWithProduct(item);
  res.status(201).json(AddToCartResponse.parse(withProduct));
});

router.patch("/cart/items/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramParsed = UpdateCartItemParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateCartItemBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }
  const [updated] = await db
    .update(cartItemsTable)
    .set({ quantity: bodyParsed.data.quantity })
    .where(eq(cartItemsTable.id, paramParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const withProduct = await buildCartItemWithProduct(updated);
  res.json(UpdateCartItemResponse.parse(withProduct));
});

router.delete("/cart/items/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = RemoveCartItemParams.safeParse({ id: parseInt(rawId, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, parsed.data.id));
  res.status(204).send();
});

router.delete("/cart", async (req, res): Promise<void> => {
  const parsed = ClearCartQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, parsed.data.sessionId));
  res.status(204).send();
});

export default router;
