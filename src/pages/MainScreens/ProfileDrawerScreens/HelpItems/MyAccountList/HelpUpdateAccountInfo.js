import { 
  SafeAreaView, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Image, 
  View 
} from 'react-native'
import React from 'react'
import { UMColors } from '../../../../../utils/ColorHelper'
import CustomNavbar from '../../../../Components/CustomNavbar'
import { UMIcons } from '../../../../../utils/imageHelper'

const deviceWidth = Dimensions.get('screen').width

export default HelpUpdateAccountInfo = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'Update Account Info'}
      />
      <ScrollView style={styles.componentBody} contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={styles.componentTxt}>
          To change your personal information assoiciated with your account, go to Profile Section on our app.
        </Text>
        <Image
          style={{ width: '90%', height: 70, marginTop: 10 }}
          source={UMIcons.updateProfile}
          resizeMode='contain'
        />
        <View style={styles.twoRowImageContainer}>
          <Image
            style={{ width: '45%', height: 250 }}
            source={UMIcons.updateAccountInfo1}
            resizeMode='contain'
          />
          <Image
            style={{ width: '45%', height: 250 }}
            source={UMIcons.updateAccountInfo2}
            resizeMode='contain'
          />
        </View>
        <Image
          style={{ width: '45%', height: 250, marginTop: 10, marginBottom: 20 }}
          source={UMIcons.updateAccountInfo3}
          resizeMode='contain'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  componentBody: {
    marginTop: 30,
    width: deviceWidth / 1.2,
  },
  componentTxt: {
    fontSize: 14,
    color: UMColors.black
  },
  twoRowImageContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
})