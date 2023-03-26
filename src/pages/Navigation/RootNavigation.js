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
import ExclusiveBooking1 from '../MainScreens/Booking/Exclusive/ExclusiveBooking1';
import ExclusiveBooking2 from '../MainScreens/Booking/Exclusive/ExclusiveBooking2';
import ExclusiveBooking3 from '../MainScreens/Booking/Exclusive/ExclusiveBooking3';
import ExclusiveBooking4 from '../MainScreens/Booking/Exclusive/ExclusiveBooking4';
import ExclusiveBooking5 from '../MainScreens/Booking/Exclusive/ExclusiveBooking5';
import ExclusiveBooking6 from '../MainScreens/Booking/Exclusive/ExclusiveBooking6';
import ExclusiveBooking7 from '../MainScreens/Booking/Exclusive/ExclusiveBooking7';
import ExclusiveBookingCancelScreen from '../MainScreens/Booking/Exclusive/ExclusiveBookingCancelScreen';
import ExclusiveBookingDriverLocation from '../MainScreens/Booking/Exclusive/ExclusiveBookingDriverLocation';
import Dashboard from '../MainScreens/Dashboard';
import SelectPaymentScreen from '../MainScreens/Payment/SelectPaymentScreen';
import PaymentMethodScreen from '../MainScreens/Payment/PaymentMethodScreen';
import AddPaymentMethodScreen from '../MainScreens/Payment/AddPaymentMethodScreen';
import AddPaymentMethodWebView from '../MainScreens/Payment/AddPaymentMethodWebView';

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
      <Stack.Screen name="ExclusiveBooking1" component={ExclusiveBooking1} />
      <Stack.Screen name="ExclusiveBooking2" component={ExclusiveBooking2} />
      <Stack.Screen name="ExclusiveBooking3" component={ExclusiveBooking3} />
      <Stack.Screen name="ExclusiveBooking4" component={ExclusiveBooking4} />
      <Stack.Screen name="ExclusiveBooking5" component={ExclusiveBooking5} />
      <Stack.Screen name="ExclusiveBooking6" component={ExclusiveBooking6} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ExclusiveBooking7" component={ExclusiveBooking7} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ExclusiveBookingDriverLocation" component={ExclusiveBookingDriverLocation} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ExclusiveBookingCancelScreen" component={ExclusiveBookingCancelScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ gestureEnabled: false }} />
      <Stack.Screen name="SelectPaymentScreen" component={SelectPaymentScreen} />
      <Stack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} />
      <Stack.Screen name="AddPaymentMethodScreen" component={AddPaymentMethodScreen} />
      <Stack.Screen name="AddPaymentMethodWebView" component={AddPaymentMethodWebView} />
      {/* There are Pages in the Archive and Hidden Folder */}

    </Stack.Navigator>
  </NavigationContainer>
  )
}
