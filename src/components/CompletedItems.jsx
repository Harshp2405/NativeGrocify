import { View, Text, Pressable } from "react-native";
import React from "react";
import { useGroceryStore } from "@/store/groceryStore";
import { FontAwesome6 } from "@expo/vector-icons";

const CompletedItems = () => {
	const { items, togglePurchased, removeItem } = useGroceryStore();

    const completed = items.filter(item => item.purchased);
	
    if(!completed.length) {
        return null;
    }
    return (
			<View className="mt-3 rounded-3xl border border-border bg-secondery p-4">
				<Text className="text-sm font-semibold uppercase tracking-[1px] text-secondary-foreground">
					Completed
				</Text>
				{completed.map((item) => (
					<View
						key={item.id}
						className="mt-3 flex-row items-center justify-between rounded-2xl border border-border bg-card px-3 py-2">
						<View className="flex-row items-center gap-2">
							<Pressable
								className="h-6 w-6 items-center justify-center rounded-full bg-primary"
								onPress={async () => {
									await togglePurchased(item.id);
								}}>
								<FontAwesome6 name="check" size={12} color="#ffffff" />
							</Pressable>

							<Text className="text-base text-muted-foreground line-through">
								{item.name}
							</Text>

							<Pressable
								className="h-8 w-8 items-center justify-center rounded-xl bg-destructive"
								onPress={async () => {
									await removeItem(item.id);
								}}>
								<FontAwesome6 name="trash" size={12} color="#d45f58" />
							</Pressable>
						</View>
					</View>
				))}
			</View>
		);
};

export default CompletedItems;
