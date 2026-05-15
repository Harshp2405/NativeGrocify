import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";
import DropDown from "@/components/DropDown/DropDown";
import CheckBoxList from "@/components/CheckBox/CheckBoxList";
import RadioButtonList from "@/components/Radio/RadioButtonList";
import Combo from "@/components/Combo/Combo";

const TestApi = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	// DropDown state — single selected user
	const [selectedUser, setSelectedUser] = useState(null);

	// CheckBoxList state — multiple selected users
	const [checkedUsers, setCheckedUsers] = useState([]);

	// RadioButtonList state — one selected user
	const [radioUser, setRadioUser] = useState(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch(
				"https://jsonplaceholder.typicode.com/users",
			)
				.then((res) => res.json())
				.catch((err) => {
					console.error("Error parsing JSON:", err);
					return [];
				});

			setUsers(response);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	// Use local user.json as options source
	const userOptions = users.map((u) => ({
		label: u.name,
		value: u.id,
		// image: `https://i.pravatar.cc/150?u=${u.id}`,
	}));
// 	const userOptions = users.map((u) => ({
//     label: u.name,
//     value: u.name,
//   }));

  useEffect(()=>{
	console.log(selectedUser , "selectedUser")
	console.log(checkedUsers , "checkedUsers")
	console.log(radioUser , "radioUser")
  } , [selectedUser||
checkedUsers||
radioUser])

	if (loading) {
		return <ActivityIndicator size="large" color="blue" />;
	}

	return (
		<SafeAreaView
			className="flex-1 bg-background dark:bg-background"
			edges={["top"]}>
			<LegendList
				data={users}
				keyExtractor={(item) => item.id.toString()}
				estimatedItemSize={72}
				contentContainerStyle={{ padding: 20, gap: 24 }}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<View className="rounded-2xl border border-border bg-card px-4 py-3">
						<Text className="text-base font-semibold text-card-foreground">
							{item.name}
						</Text>
						<Text className="text-sm text-muted-foreground">{item.email}</Text>
					</View>
				)}
				ListHeaderComponent={
					<Text className="text-base font-bold text-foreground">
						Users (LegendList)
					</Text>
				}
				ListFooterComponent={
					<View style={{ gap: 24, marginTop: 8 }}>
						{/* DropDown */}
						<View className="gap-2">
							<DropDown
								label="Select a User (DropDown)"
								options={userOptions}
								value={selectedUser}
								onChange={setSelectedUser}
								placeholder="Pick a user..."
							/>
							{selectedUser && (
								<Text className="text-sm text-muted-foreground px-1">
									Selected ID: {selectedUser} —{" "}
									{users.find((u) => u.id === selectedUser)?.email}
								</Text>
							)}
						</View>

						{/* CheckBoxList */}
						<View className="gap-2">
							<CheckBoxList
								label="Select Multiple Users (CheckBox)"
								options={userOptions}
								values={checkedUsers}
								onChange={setCheckedUsers}
							/>
							{checkedUsers.length > 0 && (
								<Text className="text-sm text-muted-foreground px-1">
									Checked IDs: {checkedUsers.join(", ")}
								</Text>
							)}
						</View>
						{/* ComboList */}
						<View className="gap-2">
							<Combo
								label="Select Multiple Users (CheckBox)"
								options={userOptions}
								values={checkedUsers}
								onChange={setCheckedUsers}
							/>
							{checkedUsers.length > 0 && (
								<Text className="text-sm text-muted-foreground px-1">
									Checked IDs: {checkedUsers.join(", ")}
								</Text>
							)}
						</View>

						{/* RadioButtonList */}
						<View className="gap-2">
							<RadioButtonList
								label="Select One User (Radio)"
								options={userOptions}
								value={radioUser}
								onChange={setRadioUser}
							/>
							{radioUser && (
								<Text className="text-sm text-muted-foreground px-1">
									Selected: {users.find((u) => u.id === radioUser)?.username}
								</Text>
							)}
						</View>
					</View>
				}
			/>
		</SafeAreaView>
	);
};

export default TestApi;
