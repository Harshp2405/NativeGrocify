import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroceryStore } from '@/store/groceryStore';
import TabScreenBackground from '@/components/TabScreenBackground';
import { FontAwesome6 } from '@expo/vector-icons';
import PlannerHero from '@/components/PlannerHero';
import PlannerFormCard from '@/components/PlannerFormCard ';

const Planner = () => {

	const { items, togglePurchased, removeItem } = useGroceryStore();
	
	const pendingItems = items.filter((item) => !item.purchased).length;
	
	const highpriorityItems = items.filter((item) => !item.purchased && item.priority === "high").length;

	const totalquantity = items.filter((item) => !item.purchased).reduce((sum , item)=> sum + item.quantity , 0);

  return (
		<>
			<ScrollView
				className="flex-1 bg-background dark:bg-background py-4"
				contentInsetAdjustmentBehavior="automatic"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 10, gap: 10 }}>
				<TabScreenBackground />

				<View className="gap-4 rounded-3xl border border-border bg-card/70 p-5">
					<View className="flex-row items-start justify-between">
						<View className="flex-1 pr-4">
							<Text className="text-xs font-semibold uppercase tracking-[1.2px] text-muted-foreground">
								Grocery planner
							</Text>

							<Text className="mt-1 text-3xl font-bold leading-9 text-foreground">
								Plan smarter, shop calmer.
							</Text>

							<Text className="mt-2 text-sm leading-5 text-muted-foreground">
								Organize your next grocery run with categories, quantities, and
								priority in one place.
							</Text>
						</View>

						<View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary">
							<FontAwesome6
								name="wand-magic-sparkles"
								size={18}
								color="#ffffff"
							/>
						</View>
					</View>

					<View className="flex-row gap-2">
						<View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
							<Text className="text-sm font-medium uppercase  text-foreground">
								Pending
							</Text>
							<Text className="text-2xl font-bold text-foreground">
								{pendingItems}
							</Text>
						</View>
						<View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
							<Text className="text-sm font-medium uppercase  text-foreground">
								Total Quantity
							</Text>
							<Text className="text-2xl font-bold text-foreground">
								{totalquantity}
							</Text>
						</View>
						<View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
							<Text className="text-sm font-medium uppercase  text-foreground">
								High Priority Items
							</Text>
							<Text className="text-2xl font-bold text-foreground">
								{highpriorityItems}
							</Text>
						</View>
					</View>
				</View>

				<PlannerHero />

				<View className="px-1">
					<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
						Build your list
					</Text>
					<Text className="mt-1 text-sm text-muted-foreground">
						Add items with the right quantity, category, and urgency.
					</Text>
				</View>

<PlannerFormCard />



			</ScrollView>
		</>
	);
}

export default Planner