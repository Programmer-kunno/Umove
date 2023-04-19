import { StatusBar } from 'react-native'
import React, { Component } from 'react'
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomDrawer from '../Components/CustomDrawer';
import { setTopNavigationRef } from '../../utils/navigationHelper';

import Landing from '../Landing';
import Start1 from '../Start/Start1';
import Start2 from '../Start/Start2';
import Login from '../Login/Login';
import ForgotPassword from '../Login/ForgotPassword';
import SignUpScreen from '../SignUp/SignUpScreen';
import SignUpScreen1 from '../SignUp/SignUpScreens/SignUpScreen1';
import SignUpScreen2 from '../SignUp/SignUpScreens/SignUpScreen2';
import SignUpScreen3 from '../SignUp/SignUpScreens/SignUpScreen3';
import SignUpScreen4 from '../SignUp/SignUpScreens/SignUpScreen4';
import SignUpScreen5 from '../SignUp/SignUpScreens/SignUpScreen5';
import SignUpScreen6 from '../SignUp/SignUpScreens/SignUpScreen6';
import QuickQuotationItemDesc from '../QuickQuotation/QuickQuotationItemDesc';
import QuickQuotationPickUp from '../QuickQuotation/QuickQuotationPickUp';
import QuickQuotationDelivery from '../QuickQuotation/QuickQuotationDelivery';
import QuickQuotateScreen from '../QuickQuotation/QuickQuotateScreen';
import QuickQuotatePriceScreen from '../QuickQuotation/QuickQuotatePriceScreen';
import BookingItemScreen from '../MainScreens/Booking/BookingItemScreen';
import BookingPickUpScreen from '../MainScreens/Booking/BookingPickUpScreen';
import BookingDropOffScreen from '../MainScreens/Booking/BookingDropOffScreen';
import BookingDescriptionScreen from '../MainScreens/Booking/BookingDescriptionScreen';
import BookingProcessingScreen from '../MainScreens/Booking/BookingProcessingScreen';
import BookingFindingDriverScreen from '../MainScreens/Booking/BookingFindingDriverScreen';
import BookingAndDriverDescription from '../MainScreens/Booking/BookingAndDriverDescription';
import BookingCancelScreen from '../MainScreens/Booking/BookingCancelScreen';
import BookingDriverLocation from '../MainScreens/Booking/BookingDriverLocation';
import Dashboard from '../MainScreens/Dashboard';
import SelectPaymentScreen from '../MainScreens/Payment/SelectPaymentScreen';
import PaymentMethodScreen from '../MainScreens/Payment/PaymentMethodScreen';
import AddPaymentMethodScreen from '../MainScreens/Payment/AddPaymentMethodScreen';
import AddPaymentMethodWebView from '../MainScreens/Payment/AddPaymentMethodWebView';
import ReceiptScreen from '../MainScreens/Payment/ReceiptScreen';
import SuccessPaymentScreen from '../MainScreens/Payment/SuccessPaymentScreen';
import PaymentLoadingScreen from '../MainScreens/Payment/PaymentLoadingScreen';
import TransactionScreen from '../Transactions/TransactionScreen';
import TermsAndCondition from '../MainScreens/ProfileDrawerScreens/TermsAndCondition';
import DataPrivacy from '../MainScreens/ProfileDrawerScreens/DataPrivacy';
import Help from '../MainScreens/ProfileDrawerScreens/Help';
import ChooseToEditScreen from '../MainScreens/EditProfile/ChooseToEditScreen';
import UserProfileScreen from '../MainScreens/EditProfile/UserProfileScreen';
import CompanyProfileScreen from '../MainScreens/EditProfile/CompanyProfileScreen';
import EditName from '../MainScreens/EditProfile/EditUserScreens/EditName';
import EditUsername from '../MainScreens/EditProfile/EditUserScreens/EditUsername';
import EditEmail from '../MainScreens/EditProfile/EditUserScreens/EditEmail';
import EditMobileNumber from '../MainScreens/EditProfile/EditUserScreens/EditMobileNumber';
import EditAddress from '../MainScreens/EditProfile/EditUserScreens/EditAddress';
import EditValidID from '../MainScreens/EditProfile/EditUserScreens/EditValidID';

export default RootNavigation = () => {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const deviceWidth = Dimensions.get('screen').width
  const deviceHeigth = Dimensions.get('screen').height

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  

  const DrawerNavigation = () => {
    return ( 
      <Drawer.Navigator 
        drawerContent={(props) => 
          <CustomDrawer {...props}/>
        } 
        initialRouteName={'Dashboard'}
        screenOptions={{ 
          headerShown: false, 
          drawerType: 'front', 
          drawerStyle: {
            backgroundColor: 'transparent',
          }, 
          swipeEdgeWidth: 0
        }}
      >
        <Drawer.Screen name={'Dashboard'} component={Dashboard}/>
      </Drawer.Navigator>
    )
  }

  return (
    <NavigationContainer ref={ref => setTopNavigationRef(ref)}>
    <StatusBar barStyle="dark-content" translucent backgroundColor={'transparent'} />
    <Stack.Navigator initialRouteName="Landing" screenOptions={{headerShown: false}} >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Start1" component={Start1} options={{ cardStyleInterpolator: forFade, gestureEnabled: false }} />
      <Stack.Screen name="Start2" component={Start2} options={{ cardStyleInterpolator: forFade}} />
      <Stack.Screen name="Login" component={Login} options={{ cardStyleInterpolator: forFade, gestureEnabled: false }} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ cardStyleInterpolator: forFade, gestureEnabled: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SignUpScreen1" component={SignUpScreen1} options={{ cardStyleInterpolator: forFade }} />
      <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
      <Stack.Screen name="SignUpScreen3" component={SignUpScreen3} />
      <Stack.Screen name="SignUpScreen4" component={SignUpScreen4} />
      <Stack.Screen name="SignUpScreen5" component={SignUpScreen5} />
      <Stack.Screen name="SignUpScreen6" component={SignUpScreen6} />
      <Stack.Screen name="QuickQuotationItemDesc" component={QuickQuotationItemDesc} options={{ cardStyleInterpolator: forFade, gestureEnabled: false }} />
      <Stack.Screen name="QuickQuotationPickUp" component={QuickQuotationPickUp} />
      <Stack.Screen name="QuickQuotationDelivery" component={QuickQuotationDelivery} />
      <Stack.Screen name="QuickQuotateScreen" component={QuickQuotateScreen} />
      <Stack.Screen name="QuickQuotatePriceScreen" component={QuickQuotatePriceScreen} />
      <Stack.Screen name="BookingItemScreen" component={BookingItemScreen} />
      <Stack.Screen name="BookingPickUpScreen" component={BookingPickUpScreen} />
      <Stack.Screen name="BookingDropOffScreen" component={BookingDropOffScreen} />
      <Stack.Screen name="BookingDescriptionScreen" component={BookingDescriptionScreen} />
      <Stack.Screen name="BookingProcessingScreen" component={BookingProcessingScreen} />
      <Stack.Screen name="BookingFindingDriverScreen" component={BookingFindingDriverScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="BookingAndDriverDescription" component={BookingAndDriverDescription} options={{ gestureEnabled: false }} />
      <Stack.Screen name="BookingDriverLocation" component={BookingDriverLocation} options={{ gestureEnabled: false }} />
      <Stack.Screen name="BookingCancelScreen" component={BookingCancelScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ gestureEnabled: false }} />
      <Stack.Screen name="SelectPaymentScreen" component={SelectPaymentScreen} />
      <Stack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} />
      <Stack.Screen name="AddPaymentMethodScreen" component={AddPaymentMethodScreen} />
      <Stack.Screen name="AddPaymentMethodWebView" component={AddPaymentMethodWebView} />
      <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
      <Stack.Screen name="SuccessPaymentScreen" component={SuccessPaymentScreen} />
      <Stack.Screen name="PaymentLoadingScreen" component={PaymentLoadingScreen} />
      <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
      <Stack.Screen name="DataPrivacy" component={DataPrivacy} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="ChooseToEditScreen" component={ChooseToEditScreen} />
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
      <Stack.Screen name="CompanyProfileScreen" component={CompanyProfileScreen} />
      {/* Edit Profile Screens */}
      <Stack.Screen name="EditName" component={EditName} />
      <Stack.Screen name="EditUsername" component={EditUsername} />
      <Stack.Screen name="EditEmail" component={EditEmail} />
      <Stack.Screen name="EditMobileNumber" component={EditMobileNumber} />
      <Stack.Screen name="EditAddress" component={EditAddress} />
      <Stack.Screen name="EditValidID" component={EditValidID} />

      {/* There are Pages in the Archive and Hidden Folder */}

    </Stack.Navigator>
  </NavigationContainer>
  )
}
