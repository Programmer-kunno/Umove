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
import IndivSignUp1 from '../SignUp/Individual/IndivSignUp1';
import IndivSignUp2 from '../SignUp/Individual/IndivSignUp2';
import IndivSignUp3 from '../SignUp/Individual/IndivSignUp3';
import CorpSignUp1 from '../SignUp/Corporate/CorpSignUp1';
import CorpSignUp2 from '../SignUp/Corporate/CorpSignUp2';
import CorpSignUp3 from '../SignUp/Corporate/CorpSignUp3';
import CorpSignUp4 from '../SignUp/Corporate/CorpSignUp4';
import CorpSignUp5 from '../SignUp/Corporate/CorpSignUp5';
import CorpSignUp6 from '../SignUp/Corporate/CorpSignUp6';
import QuickQuotationItemDesc from '../QuickQuotation/QuickQuotationItemDesc';
import QuickQuotationPickUp from '../QuickQuotation/QuickQuotationPickUp';
import QuickQuotationDelivery from '../QuickQuotation/QuickQuotationDelivery';
import QuickQuotateScreen from '../QuickQuotation/QuickQuotateScreen';
import QuickQuotatePriceScreen from '../QuickQuotation/QuickQuotatePriceScreen';
import CorpExclusive1 from '../CorporateSide/CorpBooking/Exclusive/CorpExclusive1';
import CorpExclusive2 from '../CorporateSide/CorpBooking/Exclusive/CorpExclusive2';
import CorpExclusive3 from '../CorporateSide/CorpBooking/Exclusive/CorpExclusive3';
import CorpExclusive4 from '../CorporateSide/CorpBooking/Exclusive/CorpExclusive4';
import CorpExclusive5 from '../CorporateSide/CorpBooking/Exclusive/CorpExclusive5';
import CorpExclusive6 from '../CorporateSide/CorpBooking/Exclusive/CorpExclusive6';
import CorpExclusive7 from '../CorporateSide/CorpBooking/Exclusive/CorpExclusive7';
import CorpExclusiveCancelScreen from '../CorporateSide/CorpBooking/Exclusive/CorpExclusiveCancelScreen';
import CorpExclusiveDriverLocation from '../CorporateSide/CorpBooking/Exclusive/CorpExclusiveDriverLocation';
import CorpDashboard from '../CorporateSide/CorpDashboard';
import IndivDashboard from '../IndividualSide/IndivDashboard'

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
        initialRouteName={'CorpDashboard'}
        screenOptions={{ 
          headerShown: false, 
          drawerType: 'front', 
          drawerStyle: {
            backgroundColor: 'transparent',
          }, 
          swipeEdgeWidth: 0
        }}
      >
        <Drawer.Screen name={'CorpDashboard'} component={CorpDashboard}/>
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
      <Stack.Screen name="IndivSignUp1" component={IndivSignUp1} options={{ cardStyleInterpolator: forFade }} />
      <Stack.Screen name="IndivSignUp2" component={IndivSignUp2} />
      <Stack.Screen name="IndivSignUp3" component={IndivSignUp3} />
      <Stack.Screen name="CorpSignUp1" component={CorpSignUp1} options={{ cardStyleInterpolator: forFade }} />
      <Stack.Screen name="CorpSignUp2" component={CorpSignUp2} />
      <Stack.Screen name="CorpSignUp3" component={CorpSignUp3} />
      <Stack.Screen name="CorpSignUp4" component={CorpSignUp4} />
      <Stack.Screen name="CorpSignUp5" component={CorpSignUp5} />
      <Stack.Screen name="CorpSignUp6" component={CorpSignUp6} />
      <Stack.Screen name="QuickQuotationItemDesc" component={QuickQuotationItemDesc} options={{ cardStyleInterpolator: forFade, gestureEnabled: false }} />
      <Stack.Screen name="QuickQuotationPickUp" component={QuickQuotationPickUp} />
      <Stack.Screen name="QuickQuotationDelivery" component={QuickQuotationDelivery} />
      <Stack.Screen name="QuickQuotateScreen" component={QuickQuotateScreen} />
      <Stack.Screen name="QuickQuotatePriceScreen" component={QuickQuotatePriceScreen} />
      <Stack.Screen name="CorpExclusive1" component={CorpExclusive1} />
      <Stack.Screen name="CorpExclusive2" component={CorpExclusive2} />
      <Stack.Screen name="CorpExclusive3" component={CorpExclusive3} />
      <Stack.Screen name="CorpExclusive4" component={CorpExclusive4} />
      <Stack.Screen name="CorpExclusive5" component={CorpExclusive5} />
      <Stack.Screen name="CorpExclusive6" component={CorpExclusive6} options={{ gestureEnabled: false }} />
      <Stack.Screen name="CorpExclusive7" component={CorpExclusive7} options={{ gestureEnabled: false }} />
      <Stack.Screen name="CorpExclusiveDriverLocation" component={CorpExclusiveDriverLocation} options={{ gestureEnabled: false }} />
      <Stack.Screen name="CorpExclusiveCancelScreen" component={CorpExclusiveCancelScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="IndivDashboard" component={IndivDashboard} options={{ gestureEnabled: false }} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ gestureEnabled: false }} />
      
      {/* There are Pages in the Archive and Hidden Folder */}

    </Stack.Navigator>
  </NavigationContainer>
  )
}
