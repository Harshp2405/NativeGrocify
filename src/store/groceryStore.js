import { create } from "zustand";

export const useGroceryStore = create((set, get) => ({
	items: [],
	isLoading: false,
	error: null,

	loadItems: async () => {
		set({ isLoading: true, error: null });

		try {
			const res = await fetch("/api/items");
			const payload = await res.json();

			if (!res.ok) {
				throw new Error(`Request failed (${res.status})`);
			}

			set({ items: payload.items });
		} catch (error) {
			console.error("Error loading items:", error);

			set({
				error: "Something went wrong",
			});
		} finally {
			set({ isLoading: false });
		}
	},

	addItem: async (input) => {
		set({ error: null });

		try {
			const res = await fetch("/api/items", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: input.name,
					category: input.category,
					quantity: Math.max(1, input.quantity),
					priority: input.priority,
				}),
			});

			const payload = await res.json();

			if (!res.ok) {
				throw new Error(`Request failed (${res.status})`);
			}

			set((state) => ({
				items: [payload.item, ...state.items],
			}));

			return payload.item;
		} catch (error) {
			console.error("Error adding item:", error);

			set({
				error: "Something went wrong",
			});
		}
	},

	updateQuantity: async (id, quantity) => {
		const nextQuantity = Math.max(1, quantity);

		set({ error: null });

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					quantity: nextQuantity,
				}),
			});

			const payload = await res.json();

			if (!res.ok) {
				throw new Error(`Request failed (${res.status})`);
			}

			set((state) => ({
				items: state.items.map((item) =>
					item.id === id ? payload.item : item,
				),
			}));
		} catch (error) {
			console.error("Error updating quantity:", error);

			set({
				error: "Something went wrong",
			});
		}
	},

	togglePurchased: async (id) => {
		const currentItem = get().items.find((item) => item.id === id);

		if (!currentItem) return;

		const nextPurchased = !currentItem.purchased;

		set({ error: null });

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					purchased: nextPurchased,
				}),
			});

			const payload = await res.json();

			if (!res.ok) {
				throw new Error(`Request failed (${res.status})`);
			}

			set((state) => ({
				items: state.items.map((item) =>
					item.id === id ? payload.item : item,
				),
			}));
		} catch (error) {
			console.error("Error toggling purchased:", error);

			set({
				error: "Something went wrong",
			});
		}
	},

	removeItem: async (id) => {
		set({ error: null });

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new Error(`Request failed (${res.status})`);
			}
 
			set((state) => ({
				items: state.items.filter((item) => item.id !== id),
			}));
		} catch (error) {
			console.error("Error removing item:", error);

			set({
				error: "Something went wrong",
			});
		}
	},

	clearPurchased: async () => {
		set({ error: null });

		try {
			const res = await fetch("/api/items/clearpurchase", {
				method: "POST",
			});

			if (!res.ok) {
				throw new Error(`Request failed (${res.status})`);
			}

			const items = get().items.filter((item) => !item.purchased);

			set({ items });
		} catch (error) {
			console.error("Error clearing purchased:", error);

			set({
				error: "Something went wrong",
			});
		}
	},
}));
