import { View, Text, Pressable } from "react-native";
import React from "react";
import { useGroceryStore } from "@/store/groceryStore";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

const priorityPill = {
	low: "bg-priority-low",
	medium: "bg-priority-medium",
	high: "bg-priority-high",
};

const priorityPillText = {
	low: "text-priority-low-foreground",
	medium: "text-priority-medium-foreground",
	high: "text-priority-high-foreground",
};

const PendingitemCard = ({ item }) => {
	const { updateQuantity, togglePurchased, removeItem } = useGroceryStore();

	return (
		<View className="rounded-3xl border border-border bg-card p-4">
			<View className="flex-row items-start gap-3">
				<Pressable
					onPress={() => togglePurchased(item.id)}
					className="mt-1 size-6 items-center justify-center rounded-full border-2 border-border bg-card"></Pressable>

				<View className="flex-1">
					<View className="flex-row items-center justify-between gap-2">
						<Text className="flex-1 text-lg font-semibold text-card-foreground">
							{item.name}
						</Text>

						<View
							className={`rounded-full px-3 py-1 ${
								priorityPill[item.priority]
							}`}>
							<Text
								className={`text-xs font-bold uppercase ${
									priorityPillText[item.priority]
								}`}>
								{item.priority}
							</Text>
						</View>
					</View>

					<View className="mt-2 flex-row items-center gap-2">
						<View className="rounded-full bg-secondary px-3 py-1">
							<Text className="text-xs font-semibold text-secondary-foreground">
								{item.category}
							</Text>
						</View>
					</View>

					<View className="mt-3 flex-row items-center gap-2">
						<Pressable
							className="h-8 w-8 items-center justify-center rounded-xl border border-input bg-muted"
							disabled={item.quantity === 1}
							onPress={() =>
								updateQuantity(item.id, Math.max(1, item.quantity - 1))
							}>
							<FontAwesome6 name="minus" size={12} color="#3b5a4a" />
						</Pressable>
						<Text className="text-base font-semibold text-card-foreground">
							{item.quantity}
						</Text>
						<Pressable
							className="h-8 w-8 items-center justify-center rounded-xl border border-input bg-muted"
							onPress={() =>
								updateQuantity(item.id, Math.max(1, item.quantity + 1))
							}>
							<FontAwesome6 name="plus" size={12} color="#3b5a4a" />
						</Pressable>
					</View>
				</View>

				<Pressable
					className="h-9 w-9 items-center justify-center rounded-xl bg-destructive"
					onPress={() => removeItem(item.id)}>
					<FontAwesome6 name="trash" size={13} color="#d45f58" />
				</Pressable>
			</View>
		</View>
	);
};

export default PendingitemCard;
