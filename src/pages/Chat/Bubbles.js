import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import { bubbleColor } from '../../constants'
import { UMColors } from '../../utils/ColorHelper'

export const Bubbles = ({ dataLength, item, index }) => {
  const user = useSelector((state) => state.userOperations.userData)
  const sender = item.sender;
  const meSender = user.email === sender?.user_profile?.email;

  return (
    <View style={[styles.container, meSender && { justifyContent: 'flex-end' }, index !== (dataLength - 1) && { marginBottom: 15 } ,  index === 0 && { marginTop: 30 }, index === (dataLength - 1) && { marginBottom: 30 } ]}>
      { !meSender && <Image style={[styles.baseImage, { marginRight: 20 }, !sender?.user_profile?.profile_image && { resizeMode: 'contain' }]} source={{uri: sender?.user_profile?.profile_image}} />}
      <View key={`chatlist-${index}`} style={[styles.bubbleContainer, meSender && {backgroundColor: UMColors.skyBlue}]}>
        <Text>{item.message}</Text>
      </View>
      { meSender && <Image style={[styles.baseImage, { marginLeft: 20 }, !sender?.user_profile?.profile_image && { resizeMode: 'contain' }]} source={sender?.user_profile?.profile_image ? {uri: sender?.user_profile?.profile_image } : require('../../assets/icons/profile.png')} />}
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    marginHorizontal: 15,
  },
  bubbleContainer: {
    backgroundColor: 'white',
    padding: 12,
    minHeight: 100,
    minWidth: Dimensions.get("window").width * .6,
    maxWidth: Dimensions.get("window").width * .6,
    borderRadius: 10,
  },
  baseImage: {
    height: 50, 
    width: 50, 
    backgroundColor: 'white', 
    borderRadius: 25
  }
})