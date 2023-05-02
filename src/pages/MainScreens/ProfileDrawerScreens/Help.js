import { SafeAreaView, Text, StyleSheet, Image, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMIcons } from '../../../utils/imageHelper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { navigate } from '../../../utils/navigationHelper'
import { dispatch } from '../../../utils/redux'
import { setLoading } from '../../../redux/actions/Loader'
import { FetchApi } from '../../../api/fetch'
import { showError } from '../../../redux/actions/ErrorModal'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../Components/ErrorOkModal'
import { Loader } from '../../Components/Loader'

const deviceWidth = Dimensions.get('screen').width

export default Help = () => {
  const [helpData, setHelpData] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setErorr] = useState({
    value: false,
    message: ''
  })
  const helpItems = [
    // {
    //   title: 'Get help with my bookings',
    //   image: UMIcons.transactionIcon,
    //   navigate: 'MyAccountHelpList'
    // },
    // {
    //   title: 'My Support Request',
    //   image: UMIcons.headsetIcon2,
    //   navigate: 'MyAccountHelpList'
    // },
    // {
    //   title: 'Safety Concerns',
    //   image: UMIcons.shieldCheckBlackIcon,
    //   navigate: 'MyAccountHelpList'
    // },
    {
      title: 'My Account',
      image: UMIcons.navProfileIcon,
      navigate: 'MyAccountHelpList'
    },
    // {
    //   title: 'Vouchers and Rewards',
    //   image: UMIcons.voucherIcon,
    //   navigate: 'MyAccountHelpList'
    // },
    // {
    //   title: 'Payments and Refunds',
    //   image: UMIcons.walletBlackIcon,
    //   navigate: 'MyAccountHelpList'
    // },
    // {
    //   title: 'Customer Service Support',
    //   image: UMIcons.headsetIcon2
    // }
  ]

  
useEffect(() => {
  getHelpItems()
 }, [])
 
 const getHelpItems = async() => {
   dispatch(setLoading(true))
   const response = await FetchApi.helpCategories()
   console.log(response.data.data)
   if(response == undefined){
    dispatch(showError(true))
    dispatch(setLoading(false))
   } else {
    if(response?.data?.success){
      setHelpData(response?.data?.data)
      dispatch(setLoading(false))
      setIsLoaded(true)
    } else {
      setErorr({ value: true, message: response?.data?.message || response?.data })
      dispatch(setLoading(false))
    }
   }
 }

  const renderAPIHelpItems = () => {
    return (
      helpData.map((items, index) => (
        <TouchableOpacity key={index} style={[ styles.itemBtn, index === 0 ]}
          onPress={() => navigate('BackendHelpScreen', { data: items })}
        >
          {/* <Image
            style={styles.itemImage}
            source={items.image}  
            resizeMode='contain'
          /> */}
          <Text style={styles.itemTxt}>{items.category_name}</Text>
          <Image
            style={styles.backIcon}
            source={UMIcons.backIcon}
            resizeMode='contain'
          />
        </TouchableOpacity>
      ))
    )
  }

  const renderHelpItems = () => {
    return (
      helpItems.map((items, index) => (
        <TouchableOpacity key={index} style={[ styles.itemBtn, index === 0 && { marginTop: 25 } ]}
          onPress={() => navigate(items.navigate)}
        >
          {/* <Image
            style={styles.itemImage}
            source={items.image}  
            resizeMode='contain'
          /> */}
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
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => setErorr({ value: false, message: '' })}
      />
      <CustomNavbar
        Title={'How can we help?'}
      />
      {
        isLoaded && renderHelpItems()
      }
      {renderAPIHelpItems()}

      {/* <View style={styles.chatSupportMainContainer}>
        <Text style={[styles.chatSupportTxt, { marginBottom: 40 }]}>Do you have any question?</Text>
        <View style={styles.chatSupportContainer}>
          <TouchableOpacity

          >
            <Image
              style={styles.chatSupportComponentIcon}
              source={UMIcons.orangeCircleTarget}
              resizeMode='contain'
            />
            <Text style={[styles.chatSupportTxt, { marginTop: 10 }]}>Case Track</Text>
          </TouchableOpacity>
          <TouchableOpacity

          >
            <Image
              style={styles.chatSupportComponentIcon}
              source={UMIcons.orangeCircleHeadset}
              resizeMode='contain'
            />
            <Text style={[styles.chatSupportTxt, { marginTop: 10 }]}>Call Support</Text>
          </TouchableOpacity>
        </View>
      </View> */} 
      <Loader/>     
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
    width: deviceWidth / 1.15,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  itemImage: {
    height: 30,
    width: 60
  },
  itemTxt: {
    color: UMColors.primaryOrange,
    fontSize: 14,
    fontWeight: 'bold',
    width: '72%'
  },
  backIcon: {
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