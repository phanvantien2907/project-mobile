import { Text, View } from 'react-native'
import React, { Component } from 'react'

export default class index extends Component {
  render() {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-center font-bold text-blue-500'>Quản lý phòng ban</Text>
      </View>
    )
  }
}