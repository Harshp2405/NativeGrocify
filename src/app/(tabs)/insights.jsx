import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
const Insights = () => {
  return (
		<SafeAreaView
			className="flex-1 bg-background dark:bg-background"
			edges={["top"]}>
			<View>
				<Text className="text-3xl font-extrabold text-foreground dark:text-foreground">
					Insights
				</Text>
			</View>
		</SafeAreaView>
	);
}

export default Insights