import { Show, useUser } from "@clerk/expo";
import { useClerk } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	return (
		<SafeAreaView className="flex-1 bg-background dark:bg-background">
			<View className="flex-1 px-6 pt-8 gap-4">
				<Text className="text-3xl font-extrabold text-foreground dark:text-foreground">
					Welcome!
				</Text>

				<Show when="signed-out">
					<Link href="/(auth)/sign-in">
						<Text className="text-primary dark:text-primary font-semibold text-base">
							Sign in
						</Text>
					</Link>
					<Link href="/(auth)/sign-up">
						<Text className="text-primary dark:text-primary font-semibold text-base">
							Sign up
						</Text>
					</Link>
				</Show>

				<Show when="signed-in">
					<Text className="text-foreground dark:text-foreground text-base">
						Hello {user?.emailAddresses[0].emailAddress}
					</Text>
					<Pressable
						className="bg-primary h-14 rounded-2xl items-center justify-center active:opacity-90"
						onPress={() => signOut()}
					>
						<Text className="text-primary-foreground font-semibold text-base">
							Sign out
						</Text>
					</Pressable>
				</Show>
			</View>
		</SafeAreaView>
	);
}

