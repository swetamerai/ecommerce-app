import { Router } from "express";
import { eq, like, and, sql } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductResponse,
  CreateProductResponse,
  UpdateProductResponse,
} from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search, page = 1, limit = 12 } = parsed.data;

  const conditions: ReturnType<typeof eq>[] = [];
  if (category) conditions.push(eq(categoriesTable.slug, category));
  if (search) conditions.push(like(productsTable.name, `%${search}%`));

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
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit)
    .offset((page - 1) * limit);

  const mapped = rows.map((r) => ({
    ...r,
    price: parseFloat(r.price),
    createdAt: r.createdAt.toISOString(),
  }));

  res.json(ListProductsResponse.parse(mapped));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, description, price, stock, categoryId, imageUrl, isActive } = parsed.data;
  const [product] = await db
    .insert(productsTable)
    .values({ name, description, price: String(price), stock, categoryId, imageUrl, isActive: isActive ?? true })
    .returning();

  const cat = categoryId
    ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId)).then((r) => r[0])
    : null;

  res.status(201).json(
    CreateProductResponse.parse({
      ...product,
      price: parseFloat(product.price),
      categoryName: cat?.name ?? null,
      createdAt: product.createdAt.toISOString(),
    }),
  );
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

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
    .where(eq(productsTable.id, parsed.data.id));

  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const r = rows[0];
  res.json(
    GetProductResponse.parse({
      ...r,
      price: parseFloat(r.price),
      createdAt: r.createdAt.toISOString(),
    }),
  );
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramParsed = UpdateProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!paramParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateProductBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const { name, description, price, stock, categoryId, imageUrl, isActive } = bodyParsed.data;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = String(price);
  if (stock !== undefined) updates.stock = stock;
  if (categoryId !== undefined) updates.categoryId = categoryId;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (isActive !== undefined) updates.isActive = isActive;

  const [updated] = await db
    .update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, paramParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const cat = updated.categoryId
    ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, updated.categoryId)).then((r) => r[0])
    : null;

  res.json(
    UpdateProductResponse.parse({
      ...updated,
      price: parseFloat(updated.price),
      categoryName: cat?.name ?? null,
      createdAt: updated.createdAt.toISOString(),
    }),
  );
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = DeleteProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(productsTable).where(eq(productsTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
