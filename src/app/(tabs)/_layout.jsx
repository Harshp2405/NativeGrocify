import { useGroceryStore } from "@/store/groceryStore";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack, useFocusEffect } from "expo-router";
import { NativeTabs } from "expo-router/build/native-tabs";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect } from "react";

export default function TabsLayout() {
	const { isSignedIn, isLoaded } = useAuth();

	const { loadItems, items } = useGroceryStore();

	const colorScheme = useColorScheme()
	const isdark = colorScheme === "dark"; 

	// useEffect(()=>{
	// 	loadItems();
	// },[])

	useFocusEffect(
		useCallback(() => {
			loadItems();
		}, []),
	);

	console.log(items, "items");

	if (!isLoaded) {
		return null;
	}

	if (!isSignedIn) {
		return <Redirect href="/(auth)/sign-in" />;
	}


	return (
		<NativeTabs tintColor={isdark ? "hsl(142 70% 54%)" : "hsl(147 75% 33%)"}>
			<NativeTabs.Trigger name="index" href="/(tabs)/">
				<NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="list.bullet.clipboard" md="home" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="planner" href="/(tabs)/planner">
				<NativeTabs.Trigger.Label>Planner</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="plus.circle" md="event" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="insights" href="/(tabs)/insights">
				<NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="chart.bar.fill" md="insights" />
			</NativeTabs.Trigger>
			{/* <NativeTabs.Trigger name="testapi" href="/(tabs)/testapi">
				<NativeTabs.Trigger.Label>Test API</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="chart.bar.fill" md="insights" />
			</NativeTabs.Trigger> */}
		</NativeTabs>
	);
}
