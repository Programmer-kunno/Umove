import { 
  Text, 
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { useSelector } from 'react-redux';
import { navigate } from '../../utils/navigationHelper';

export default TopDashboardNavbar = (props) => {  

  const user = useSelector((state) => state.userOperations.userData)

  const navigation = useNavigation()

    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerLeftBtn}
            onPress={() => {
              navigation.openDrawer()
            }}
          >
            <Image
              style={{width: '45%'}}
              source={UMIcons.burgerMenuIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerMiddle}>
          <View style={styles.headerMiddleContainer}>
            <Image
              style={{width: '70%', height: '70%'}}
              source={UMIcons.mainLogo}
              resizeMode={'contain'}
            />
            <Text style={styles.headerTitle}>{user.customer_type == "individual" ? "Individual" : "Corporate"}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerRightBtn}
            onPress={() => {
              navigate('Notification')
            }}
          >
            <Image
              style={{width: '50%'}}
              source={UMIcons.notificationIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: '12%',
    width: '100%',
    backgroundColor: UMColors.BGOrange,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: '10%'
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerLeftBtn: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMiddle: {
    flex: 1,
    alignItems: 'center',
  },
  headerMiddleContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: UMColors.black,
    fontSize: 11,
    fontWeight: 'bold',
    top: -7
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerRightBtn: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
