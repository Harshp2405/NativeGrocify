import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { socket } from "../lib/socket";

// Robust Storage Helpers with Web Fallback
const setStorageItem = async (key, value) => {
	try {
		if (Platform.OS === "web") {
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, value);
			}
			return;
		}
		await SecureStore.setItemAsync(key, value);
	} catch (err) {
		console.error("Storage write error:", err);
	}
};

const getStorageItem = async (key) => {
	try {
		if (Platform.OS === "web") {
			return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
		}
		return await SecureStore.getItemAsync(key);
	} catch (err) {
		console.error("Storage read error:", err);
		return null;
	}
};

const deleteStorageItem = async (key) => {
	try {
		if (Platform.OS === "web") {
			if (typeof window !== "undefined") {
				window.localStorage.removeItem(key);
			}
			return;
		}
		await SecureStore.deleteItemAsync(key);
	} catch (err) {
		console.error("Storage delete error:", err);
	}
};

export const useGroceryStore = create((set, get) => {
	// Store listener references to prevent memory leaks and duplicates
	let handleItemAdded;
	let handleItemUpdated;
	let handleItemDeleted;
	let handleReceiveMessage;

	return {
		items: [],
		roomId: null,
		activeShoppers: [],
		messages: [],
		isLoading: false,
		error: null,

		// =========================
		// ROOM MANAGEMENT
		// =========================

		createRoom: async () => {
			const roomId = nanoid();
			set({ roomId });
			await setStorageItem("grocify_room_id", roomId);
			if (!socket.connected) {
				socket.connect();
			}
			socket.emit("join-room", roomId);
			return roomId;
		},

		joinRoom: async (roomId) => {
			set({ roomId });
			await setStorageItem("grocify_room_id", roomId);
			if (!socket.connected) {
				socket.connect();
			}
			socket.emit("join-room", roomId);
		},

		leaveRoom: async () => {
			const currentRoomId = get().roomId;
			if (currentRoomId) {
				socket.emit("leave-room", currentRoomId);
			}
			set({ roomId: null, activeShoppers: [], messages: [] });
			await deleteStorageItem("grocify_room_id");
		},

		loadPersistedRoom: async () => {
			const savedRoomId = await getStorageItem("grocify_room_id");
			if (savedRoomId) {
				set({ roomId: savedRoomId });
				if (!socket.connected) {
					socket.connect();
				}
				socket.emit("join-room", savedRoomId);
				return savedRoomId;
			}
			return null;
		},

		// =========================
		// SOCKET SYNC
		// =========================

		initSocketSync: () => {
			get().cleanupSocketSync();

			handleItemAdded = (newItem) => {
				set((state) => {
					const exists = state.items.some((i) => i.id === newItem.id);
					if (exists) return state;
					return { items: [newItem, ...state.items] };
				});
			};

			handleItemUpdated = (updatedItem) => {
				set((state) => ({
					items: state.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
				}));
			};

			handleItemDeleted = (deletedItemId) => {
				set((state) => ({
					items: state.items.filter((i) => i.id !== deletedItemId),
				}));
			};

			handleReceiveMessage = (message) => {
				set((state) => ({ messages: [...state.messages, message] }));
			};

			// Listen to events emitted by server (matching casing from server.js)
			socket.on("item-added", handleItemAdded);
			socket.on("item-Updated", handleItemUpdated);
			socket.on("item-Deleted", handleItemDeleted);

			socket.on("room-presence", (users) => {
				set({ activeShoppers: users });
			});

			socket.on("receive-message", handleReceiveMessage);
		},

		cleanupSocketSync: () => {
			if (handleItemAdded) socket.off("item-added", handleItemAdded);
			if (handleItemUpdated) socket.off("item-Updated", handleItemUpdated);
			if (handleItemDeleted) socket.off("item-Deleted", handleItemDeleted);
			if (handleReceiveMessage) socket.off("receive-message", handleReceiveMessage);
			socket.off("room-presence");
		},

		sendMessage: (text) => {
			if (!text.trim()) return;
			const message = {
				id: nanoid(),
				text: text.trim(),
				senderId: socket.id,
				timestamp: Date.now(),
			};
			set((state) => ({ messages: [...state.messages, message] }));
			socket.emit("send-message", { roomId: get().roomId, message });
		},

		// =========================
		// DATABASE & LOCAL SYNC
		// =========================

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

				// Real-time emit to other users in the room
				socket.emit("item-add", {
					roomId: get().roomId,
					item: payload.item,
				});

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

				// Real-time emit to other users in the room
				socket.emit("item-Update", {
					roomId: get().roomId,
					item: payload.item,
				});
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

				// Real-time emit to other users in the room
				socket.emit("item-Update", {
					roomId: get().roomId,
					item: payload.item,
				});
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

				// Real-time emit to other users in the room
				socket.emit("item-Delete", {
					roomId: get().roomId,
					item: id,
				});
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
				const purchasedIds = get()
					.items.filter((item) => item.purchased)
					.map((item) => item.id);

				const res = await fetch("/api/items/clearpurchase", {
					method: "POST",
				});

				if (!res.ok) {
					throw new Error(`Request failed (${res.status})`);
				}

				const nextItems = get().items.filter((item) => !item.purchased);
				set({ items: nextItems });

				// Emit delete event for each cleared item
				purchasedIds.forEach((itemId) => {
					socket.emit("item-Delete", {
						roomId: get().roomId,
						item: itemId,
					});
				});
			} catch (error) {
				console.error("Error clearing purchased:", error);

			set({
				error: "Something went wrong",
			});
			}
		},
	};
});
