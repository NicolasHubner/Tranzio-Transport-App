import React from "react"
import { Image, Text, View } from "react-native"

const TabButtons: React.FC<any> = ({ focused, icon, name }) => {
  return (
    <View
      style={{
        marginTop: 16,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        padding: 4,
        borderRadius: 16,
        backgroundColor: focused ? '#fff' : 'transparent',
        width: '100%'
      }}
    >
      <Image
        style={{
          tintColor: focused ? "red" : "#D9D9D9",
          height: focused ? 14 : 12 ,
          width: focused ? 14 : 12 ,
          marginRight: 8
        }}
        source={icon}
      />
      {focused && <Text style={{ color: '#2C5484', textAlign: 'right', fontSize: 12 }}>{name}</Text>}
    </View>
  )
}

export default TabButtons
