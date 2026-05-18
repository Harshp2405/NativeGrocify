import CompletedItems from "@/components/CompletedItems";
import ListHeroCard from "@/components/ListHeroCard";
import PendingitemCard from "@/components/PendingitemCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useGroceryStore } from "@/store/groceryStore";
import { Show, useUser } from "@clerk/expo";
import { useClerk } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, View, Pressable, useColorScheme, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const { items } = useGroceryStore();

	const pendingItems = items.filter(item => !item.purchased)


	const listData = [
		{
			type: "header",
		},
		...pendingItems.map((item) => ({
			type: "item",
			data: item,
		})),
		{
			type: "footer",
		},
	];


	const renderers = {
		header: () => (
			<View style={{ gap: 15 }}>
				<ListHeroCard />

				<View className="flex-row items-center justify-between px-1">
					<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
						Shopping Items
					</Text>

					<Text className="text-sm text-muted-foreground">
						{pendingItems.length} Active
					</Text>
				</View>
			</View>
		),

		item: ({ data }) => <PendingitemCard item={data} />,

		footer: () => <CompletedItems />,
	};


	return (
		<SafeAreaView
			className="flex-1 bg-background dark:bg-background py-4"
			edges={["top"]}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 10 }}
				className="flex-1 px-6 pt-8 gap-4">
				{/* Header */}
				<TabScreenBackground />

				<FlatList
				
					className="flex-1"
					data={pendingItems}
					contentInsetAdjustmentBehavior="automatic"
					contentContainerStyle={{ padding: 10, gap: 10 }}
					renderItem={({ item }) => <PendingitemCard item={item} />}
					keyExtractor={(item) => item.id}
					ListHeaderComponent={
						<View style={{ gap: 15 }}>
							<ListHeroCard />

							<View className="flex-row items-center justify-between px-1">
								<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
									Shopping Items
								</Text>

								<Text className="text-sm text-muted-foreground">
									{pendingItems.length} Active
								</Text>
							</View>
						</View>
					}
					ListEmptyComponent={<Text className="text-2xl text-center text-white">No Data</Text>}
					ListFooterComponent={<CompletedItems />}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

// With .map 
/*

<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 20, gap: 10 }}
				className="flex-1 px-6 pt-8 gap-4">
				<TabScreenBackground />

				<ListHeroCard />

				<View className="flex-row items-center justify-between px-1">
					<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
						Shopping Items
					</Text>

					<Text className="text-sm text-muted-foreground">
						{pendingItems.length} Active
					</Text>
				</View>

				{pendingItems.map((item) => (
					<PendingitemCard key={item.id} item={item} />
				))}

				<CompletedItems />
			</ScrollView>


*/

// with flatlist

/*

<FlatList
					className="flex-1"
					data={pendingItems}
					contentInsetAdjustmentBehavior="automatic"
					contentContainerStyle={{ padding: 10, gap: 10 }}
					renderItem={({ item }) => <PendingitemCard item={item} />}
					keyExtractor={(item) => item.id}
					ListHeaderComponent={
						<View style={{ gap: 15 }}>
							<ListHeroCard />

							<View className="flex-row items-center justify-between px-1">
								<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
									Shopping Items
								</Text>

								<Text className="text-sm text-muted-foreground">
									{pendingItems.length} Active
								</Text>
							</View>
						</View>
					}
					ListEmptyComponent={<Text>No Data</Text>}
					ListFooterComponent={<CompletedItems />}
				/>

*/





// with FlashList

/*

import { FlashList } from "@shopify/flash-list";

<FlashList
					className="flex-1"
					data={pendingItems}
					estimatedItemSize={80}
					contentContainerStyle={{ padding: 10 }}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					renderItem={({ item }) => <PendingitemCard item={item} />}
					keyExtractor={(item) => item.id}
					ListHeaderComponent={
						<View style={{ gap: 15, marginBottom: 10 }}>
							<ListHeroCard />

							<View className="flex-row items-center justify-between px-1">
								<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
									Shopping Items
								</Text>

								<Text className="text-sm text-muted-foreground">
									{pendingItems.length} Active
								</Text>
							</View>
						</View>
					}
					ListEmptyComponent={<Text className="text-2xl text-center text-white">No Data</Text>}
					ListFooterComponent={<CompletedItems />}
				/>

*/