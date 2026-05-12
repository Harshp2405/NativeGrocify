import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const Planner = () => {
  return (
		<SafeAreaView
			className="flex-1 bg-background dark:bg-background"
			edges={["top"]}>
			<View>
				<Text className="text-3xl font-extrabold text-foreground dark:text-foreground">
					Planner
				</Text>
			</View>
		</SafeAreaView>
	);
}

export default Planner