import { View, Text , Image } from 'react-native'


const PlannerHero = () => {
  return (
		<View className="overflow-hidden rounded-[30px] border border-border bg-card">
			<Image
				source={require("../../assets/images/hero.png")}
				className="h-10 w-full"
				resizeMode="cover"
			/>
		</View>
	);
}

export default PlannerHero