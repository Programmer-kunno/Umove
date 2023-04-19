import { SafeAreaView, StyleSheet, Text, Image, Dimensions, View } from 'react-native'
import React from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import GrayNavbar from '../../Components/GrayNavbar'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { UMIcons } from '../../../utils/imageHelper'
import { navigate } from '../../../utils/navigationHelper'

const deviceWidth = Dimensions.get('screen').width
const deviceHeigth = Dimensions.get('screen').height

export default ChooseToEditScreen = () => {

  return (
    <SafeAreaView style={styles.mainContainer}>
      <GrayNavbar
        Title={'Edit Profile'}
      />
      <View style={styles.bodyContainer}>
        <TouchableOpacity
          style={[styles.selectionBtn, { marginTop: 10 }]}
          onPress={() => {
            navigate('UserProfileScreen')
          }}
        >
          <Text style={styles.selectionTxt}>User Profile</Text>
          <Image
            style={styles.backIcon}
            source={UMIcons.backIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectionBtn}
          onPress={() => {
            navigate('CompanyProfileScreen')
          }}
        >
          <Text style={styles.selectionTxt}>Company Profile</Text>
          <Image
            style={styles.backIcon}
            source={UMIcons.backIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  ) 
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
  },
  bodyContainer: {
    width: deviceWidth,
    height: deviceHeigth,
    alignItems: 'center'
  },
  selectionBtn: {
    width: deviceWidth / 1.08,
    borderBottomWidth: 0.5,
    borderBottomColor: UMColors.darkerGray,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between', 
    flexDirection: 'row'
  },
  selectionTxt: {
    fontSize: 15,
    color: UMColors.black,
    marginLeft: 10
  },
  backIcon: {
    height: 15,
    width: 15,
    marginRight: 30,
    tintColor: UMColors.black,
    transform: [
      { scaleX: -1 }
    ]
  }
})