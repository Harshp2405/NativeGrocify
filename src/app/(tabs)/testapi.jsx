import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const TestApi = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch(
				"https://jsonplaceholder.typicode.com/users",
			).then((res) => res.json()).then((data) => data).catch((err) => {
                console.error("Error parsing JSON:", err);
                return [];
            })

			// convert response to JSON
			
            console.log(response);
			setUsers(response);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <ActivityIndicator size="large" color="blue" />;
	}

	return (
		<SafeAreaView
			className="flex-1 bg-background dark:bg-background"
			edges={["top"]}>
			<FlatList
				data={users}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={{ padding: 20 }}
				renderItem={({ item }) => (
					<View style={{ marginBottom: 10 }}>
						<Text className="text-lg font-bold text-white">{item.name}</Text>
					</View>
				)}
			/>
		</SafeAreaView>
	);
};

export default TestApi;
