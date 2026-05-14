import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import TabScreenBackground from '@/components/TabScreenBackground';
import UserProfile from '@/components/UserProfile';
import InsightsStatsSection from '@/components/InsightsStatsSection';
import InsightsCategorySection from '@/components/InsightsCategorySection';
import InsightsPrioritySection from '@/components/InsightsPrioritySection';
import ClearCompletedButton from '@/components/ClearCompletedButton';
import SentryFeedbackButton from '@/components/SentryFeedbackButton';
const Insights = () => {
  return (
		<SafeAreaView
			className="flex-1 bg-background dark:bg-background"
			edges={["top"]}>
			<>
				<ScrollView
					className="flex-1 bg-background py-4"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ padding: 20, gap: 14 }}
					contentInsetAdjustmentBehavior="automatic">
					<TabScreenBackground />

					<UserProfile />
					<InsightsStatsSection />
					<InsightsCategorySection />
					<InsightsPrioritySection />
					<ClearCompletedButton />
				</ScrollView>

				<SentryFeedbackButton />
			</>
		</SafeAreaView>
	);
}

export default Insights