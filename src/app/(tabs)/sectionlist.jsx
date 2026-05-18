import { View, Text, SectionList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import data from "@/../section.json"

const Sectionlist = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background "
      edges={["top"]}
    >
      <View>
        <Text className="text-white">Sectionlist</Text>
      </View>

      <SectionList
        className=""
        sections={data}
        keyExtractor={(item, index) => item.id ?? String(index)}
        renderItem={({ item }) => (
          <View className="ml-2 ">
            <Text className=" text-blue-100">Item :{item.name}</Text>
            <Text className=" text-blue-100">price :{item.price}</Text>
            <Text className=" text-blue-100">
              Tags :
              {item.tags.map((tag, id) =>
                id == item.tags.length - 1 ? (
                  <Text key={id} className=" text-blue-100">
                    {tag}
                  </Text>
                ) : (
                  <Text key={id} className=" text-blue-100">
                    {tag}
                    {" , "}
                  </Text>
                ),
              )}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text className=" text-gray-50">{section.title}</Text>
        )}
      ></SectionList>
    </SafeAreaView>
  );
}

export default Sectionlist