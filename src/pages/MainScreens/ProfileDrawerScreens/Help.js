import { SafeAreaView, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import GrayNavbar from '../../Components/GrayNavbar'
import { UMIcons } from '../../../utils/imageHelper'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default Help = () => {
  const helpItems = [
    {
      title: 'Get help with my bookings',
      image: UMIcons.transactionIcon 
    },
    {
      title: 'My Support Request',
      image: UMIcons.headsetIcon2
    },
    {
      title: 'Safety Concerns',
      image: UMIcons.shieldCheckBlackIcon
    },
    {
      title: 'My Account',
      image: UMIcons.navProfileIcon
    },
    {
      title: 'Vouchers and Rewards',
      image: UMIcons.voucherIcon
    },
    {
      title: 'Payments and Refunds',
      image: UMIcons.walletBlackIcon
    },
    {
      title: 'Customer Service Support',
      image: UMIcons.headsetIcon2
    }
  ]

  const renderHelpItems = () => {
    return (
      helpItems.map((items, index) => (
        <TouchableOpacity key={index} style={[ styles.itemBtn, index === 0 && { marginTop: 25 } ]}>
          <Image
            style={styles.itemImage}
            source={items.image}  
            resizeMode='contain'
          />
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
      <GrayNavbar
        Title={'How can we help?'}
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
    width: '90%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  itemImage: {
    height: 35,
    width: 60
  },
  itemTxt: {
    color: UMColors.primaryOrange,
    fontSize: 14,
    fontWeight: 'bold',
    width: '72%'
  },
  backIcon: {
    height: 15,
    width: 15,
    tintColor: UMColors.black,
    transform: [
      { scaleX: -1 }
    ]
  }
})      