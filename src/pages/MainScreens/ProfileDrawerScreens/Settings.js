import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMColors } from '../../../utils/ColorHelper'
import { UMIcons } from '../../../utils/imageHelper'
import { navigate } from '../../../utils/navigationHelper'

const deviceWidth = Dimensions.get('screen').width

export default Settings = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'Settings'}
      />
      <TouchableOpacity
        style={[styles.optionBtn, { marginTop: 20 }]}
        onPress={() => navigate('DataPrivacy')}
      >
        <Text style={styles.optionTxt}>Data Privacy</Text>
        <Image
          style={styles.backIcon}
          source={UMIcons.backIcon}
          resizeMode='contain'
        />
      </TouchableOpacity>
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