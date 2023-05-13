import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../utils/ColorHelper'
import { UMIcons } from '../../utils/imageHelper'
import { useSelector } from 'react-redux'
import { dispatch } from '../../utils/redux'
import { userLogout } from '../../redux/actions/User'
import { resetNavigation } from '../../utils/navigationHelper'
import LinearGradient from 'react-native-linear-gradient'
import { navigate } from '../../utils/navigationHelper'
import { moneyFormat } from '../../utils/stringHelper'

export default CustomDrawer = () => {
  const deviceWidth = Dimensions.get('screen').width
  const deviceHeigth = Dimensions.get('screen').height
  const user = useSelector((state) => state.userOperations.userData)
  const userDetailsData = useSelector(state => state.userOperations.userDetailsData)
  const [name, setName] = useState('')
  
  useEffect(() => {
    setName(userDetailsData?.user?.user_profile?.first_name.charAt(0).toUpperCase() + userDetailsData?.user?.user_profile?.first_name.slice(1) + ' ' + 
            userDetailsData?.user?.user_profile?.last_name.charAt(0).toUpperCase() + userDetailsData?.user?.user_profile?.last_name.slice(1))
  }, [])

  logOut = () => {
    dispatch(userLogout())
    resetNavigation('Landing')
  }


  return (
    <LinearGradient colors={[UMColors.white, UMColors.BGOrange, UMColors.BGOrange]} style={styles.linearGradient}>
    <View style={styles.mainDrawerContainer}>
      <View style={styles.drawerContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profilePicContainer}>
           <TouchableOpacity
            style={styles.profilePicBtn}
            onPress={() => {
              navigate('Profile')
            }}
           >
            <Image
                style={styles.profilePic}
                source={userDetailsData?.user?.user_profile?.profile_image ? {uri: userDetailsData?.user?.user_profile?.profile_image} : UMIcons.userBlankProfile }
                resizeMode={'contain'}
             />
           </TouchableOpacity>
           <TouchableOpacity
            style={styles.profileEditBtn}
            onPress={() => {
              navigate('Profile')
            }}
           >
            <Image
                style={styles.editPic}
                source={UMIcons.whitePencil}
                resizeMode={'contain'}
             />
           </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{name}</Text>
        </View>
        <TouchableOpacity
          style={[styles.drawerBtn, { marginTop: '10%', justifyContent: 'space-between'}]}
          onPress={() => {
            navigate('WalletScreen')
          }}
        >
          <Image
            style={styles.drawerWalletImg}
            source={UMIcons.homeWalletIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.homeWalletBalance}>₱ {moneyFormat(userDetailsData.remaining_credits)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerBtn}
          onPress={() => {
            navigate('TransactionScreen')
          }}
        >
          <Image
            style={styles.drawerIcons}
            source={UMIcons.transactionIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.drawerTxt}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerBtn}
          onPress={() => navigate('Address')}
        >
          <Image
            style={styles.drawerIcons}
            source={UMIcons.addressIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.drawerTxt}>Address</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.drawerBtn}
        >
          <Image
            style={styles.drawerIcons}
            source={UMIcons.voucherIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.drawerTxt}>Vouchers</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.drawerBtn}
          onPress={() => {
            navigate('Help')
          }}
        >
          <Image
            style={styles.drawerIcons}
            source={UMIcons.questionIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.drawerTxt}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawerBtn, { marginTop: '15%', justifyContent: 'space-between', borderBottomWidth: 0}]}
          onPress={() => navigate('Settings')}
        >
          <Text style={[styles.drawerTxt, { marginLeft: '4%' }]}>Settings</Text>
          <Image
            style={styles.drawerIcons}
            source={UMIcons.settingsIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawerBtn, { marginTop: '2%', justifyContent: 'space-between', borderBottomWidth: 0}]}
          onPress={() => {
            navigate('TermsAndCondition')
          }}
        >
          <Text style={[styles.drawerTxt, { marginLeft: '4%' }]}>Terms and Condition</Text>
          <Image
            style={styles.drawerIcons}
            source={UMIcons.helpIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawerBtn, { marginTop: '20%', justifyContent: 'space-between', borderBottomWidth: 0 }]}
          onPress={() => logOut()}
        >
          <Text style={[styles.drawerTxt, { marginLeft: '4%' }]}>Log Out</Text>
          <Image
            style={styles.drawerIcons}
            source={UMIcons.exitIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  mainDrawerContainer: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  drawerContainer: {
    flex: 1,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '20%',
    marginTop: '15%',
  },
  profilePicBtn: {
    width: 80,
    height: 80,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  profileEditBtn: {
    position: 'absolute',
    backgroundColor: UMColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 23,
    height: 23,
    zIndex: 1,
    bottom: -1,
    right: -1
  },
  editPic: {
    width: '50%',
    height: '50%'
  },
  profilePicContainer: {
    width: 75,
    height: 75,
  },
  profileName: {
    marginTop: 15,
    color: UMColors.black,
    fontSize: 15
  },
  drawerBtn: {
    width: '100%',
    borderBottomWidth: .5,
    borderBottomColor: UMColors.primaryGray,
    height: '7%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  drawerWalletImg: {
    width: '50%',
    height: '80%',
    marginLeft: 10
  },
  homeWalletBalance: {
    fontSize: 13,
    fontWeight: 'bold',
    color: UMColors.black,
    marginRight: 10
  },
  drawerIcons: {
    height: '50%',
    width: '20%'
  },
  drawerTxt: {
    fontSize: 15,
    color: UMColors.black
  }
})