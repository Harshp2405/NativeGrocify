import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { groceryItems } from "./db/schema";

export const listGrocery = async () => {
	const rows = await db
		.select()
		.from(groceryItems)
		.orderBy(desc(groceryItems.updated_at));

	return rows;
};

export const createItem = async ({ name, category, quantity, priority }) => {
	const row = await db
		.insert(groceryItems)
		.values({
			id: crypto.randomUUID(),
			name: name,
			category: category,
			quantity: Math.max(1, quantity),
			priority: priority,
			updated_at: Date.now(),
			purchased: false,
		})
		.returning();
	return row[0];
};

export const setGroceryItemPurchased = async (id, purchased) => {
	const rows = await db
		.update(groceryItems)
		.set({
			purchased,
			updated_at: Date.now(),
		})
		.where(eq(groceryItems.id, id))
		.returning();

	if (!rows.length) return null;

	return rows[0];
};

export const updateGroceryItemQuantity = async (id, quantity) => {
	const rows = await db
		.update(groceryItems)
		.set({
			quantity: Math.max(1, Math.floor(quantity)),
			updated_at: Date.now(),
		})
		.where(eq(groceryItems.id, id))
		.returning();

	if (!rows.length) return null;

	return rows[0];
};

export const deleteGroceryItem = async (id) => {
	await db.delete(groceryItems).where(eq(groceryItems.id, id));
};

export const clearPurchasedItems = async () => {
	await db.delete(groceryItems).where(eq(groceryItems.purchased, true));
};


