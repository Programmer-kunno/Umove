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

export default HelpUpdateDocuments = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'Update Documents'}
      />
      <ScrollView style={styles.componentBody} contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={styles.componentTxt}>
          To change your company information assoiciated with your account, go to Profile Section on our app.
        </Text>
        <Image
          style={{ width: '90%', height: 70, marginTop: 10 }}
          source={UMIcons.updateProfile}
          resizeMode='contain'
        />
        <Image
          style={{ width: '45%', height: 250, marginTop: 10 }}
          source={UMIcons.updateDocuments1}
          resizeMode='contain'
        />
        <View style={styles.twoRowImageContainer}>
          <Text style={{ fontSize: 12}}>
            • Tap document to reupload
          </Text>
          <Image
            style={{ width: '45%', height: 250 }}
            source={UMIcons.updateDocuments2}
            resizeMode='contain'
          />
        </View>
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