import { View, Text } from 'react-native'
import React from 'react'

const TabScreenBackground = () => {
  return (
		<>
			<View
				pointerEvents="none"
				className="absolute -left-24 -top-10 h-64 w-64 rounded-full bg-accent"
			/>

			<View
				pointerEvents="none"
				className="absolute right-[-80px] top-20 h-72 w-72 rounded-full bg-secondary"
			/>
		</>
	);
}

export default TabScreenBackground