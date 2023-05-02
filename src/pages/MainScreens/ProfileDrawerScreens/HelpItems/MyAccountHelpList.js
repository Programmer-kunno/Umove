import { SafeAreaView, Text, StyleSheet, Image, View, Dimensions } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomNavbar from '../../../Components/CustomNavbar'
import { UMColors } from '../../../../utils/ColorHelper'
import { UMIcons } from '../../../../utils/imageHelper'
import { navigate } from '../../../../utils/navigationHelper'

const deviceWidth = Dimensions.get('screen').width

export default MyAccountHelpList = () => {
  const helpItems = [
    {
      title: 'Update my account information',
      navigate: 'HelpUpdateAccountInfo'
    },
    {
      title: 'Update company information',
      navigate: 'HelpUpdateCompanyInfo'
    },
    {
      title: 'Update my documents',
      navigate: 'HelpUpdateDocuments'
    },
    // {
    //   title: 'Forgot my Password',
    //   navigate: 'HelpUpdateAccountInfo'
    // },
    // {
    //   title: 'Account Security and Protection',
    //   navigate: 'HelpUpdateAccountInfo'
    // },
    // {
    //   title: `I can't sign up using my email address`,
    //   navigate: 'HelpUpdateAccountInfo'
    // },
    // {
    //   title: 'Delete Account',
    //   navigate: 'HelpUpdateAccountInfo'
    // },
    // {
    //   title: `Don't see your question here`,
    //   navigate: 'HelpUpdateAccountInfo'
    // },
  ]

  const renderHelpItems = () => {
    return (
      helpItems.map((items, index) => (
        <TouchableOpacity key={index} style={[ styles.itemBtn, index === 0 && { marginTop: 25 } ]} onPress={() => navigate(items.navigate)}>
          <Text style={styles.itemTxt}>{items.title}</Text>
          <Image
            style={styles.backIcon}
            source={UMIcons.backIcon}
            resizeMode='contain'
          />
        </TouchableOpacity>
      ))
    )
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'My Account'}
      />
      {renderHelpItems()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,     
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  itemBtn: {
    width: deviceWidth / 1.05,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    borderBottomWidth: 0.5
  },
  itemImage: {
    height: 30,
    width: 60
  },
  itemTxt: {
    marginLeft: 10,
    color: UMColors.primaryOrange,
    fontSize: 12,
    fontWeight: 'bold',
    width: '72%'
  },
  backIcon: {
    marginRight: 20,
    height: 12,
    width: 12,
    tintColor: UMColors.black,
    transform: [
      { scaleX: -1 }
    ]
  },
  chatSupportMainContainer: {
    width: deviceWidth,
    alignItems: 'center', 
    marginTop: 40
  },
  chatSupportTxt: {
    fontSize: 13,
    color: UMColors.black,
    fontWeight: 'bold',
  },
  chatSupportContainer: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  chatSupportComponentIcon: {
    width: 70,
    height: 70
  }
})      