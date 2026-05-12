import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { NativeTabs } from "expo-router/build/native-tabs";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
	const { isSignedIn, isLoaded } = useAuth();
	const colorScheme = useColorScheme()
	const isdark = colorScheme === "dark"; 

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
		</NativeTabs>
	);
}
