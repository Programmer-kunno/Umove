import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React from 'react'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMColors } from '../../../utils/ColorHelper'
import { UMIcons } from '../../../utils/imageHelper'
import { navigate } from '../../../utils/navigationHelper'

const deviceWidth = Dimensions.get('screen').width

export default Settings = () => {

  const settingsItems = [
    {
      id: 1,
      label: 'Data Privacy'
    },
    {
      id: 2,
      label: 'App Version'
    }
  ]

  const renderSettingsItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.optionBtn, index == 0 && { marginTop: 20 }]}
        onPress={() => {
          switch(item.id){
            case 1: {
              navigate('DataPrivacy')
            }
            case 2: {
              
            }
            default:
          }
        }}
      >
        <Text style={styles.optionTxt}>{item.label}</Text>
        <Image
          style={styles.backIcon}
          source={UMIcons.backIcon}
          resizeMode='contain'
        />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'Settings'}
      />
      <FlatList
        data={settingsItems}
        renderItem={renderSettingsItems}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange
  },
  optionBtn: {
    paddingHorizontal:  15,
    alignSelf: 'center',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    width: deviceWidth / 1.05,
    height: 55,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  optionTxt: {
    fontSize: 16,
  },
  backIcon: {
    width: 10,
    height: 20,
    tintColor: UMColors.black,
    transform: [
      { scaleX: -1 }
    ]
  }
})