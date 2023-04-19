import React, { Component } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './DashboardComponents/Home';
import Calendar from './DashboardComponents/Calendar';
import Messages from './DashboardComponents/Messages';
import Notification from './DashboardComponents/Notification';
import Profile from './DashboardComponents/Profile';
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';


const Tab = createBottomTabNavigator();

export default Dashboard = () => {
    return (
      <Tab.Navigator
        initialRoute="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let image;
            let width;
            let height;
            let activeColor;
            if (route.name === 'Home') {
              image = UMIcons.navHomeIcon
              color = focused
                ? UMColors.primaryOrange : UMColors.black
              width = 25;
              height = 25;              
            } else if(route.name === 'Calendar') {
              image = UMIcons.navCalendarIcon
              color = focused
                ? UMColors.primaryOrange : UMColors.black
              width = 25;
              height = 25;
            } else if(route.name === 'Messages') {
              image = UMIcons.navMessageIcon
              color = focused
                ? UMColors.primaryOrange : UMColors.black
              width = 25;
              height = 25;  
            } else if(route.name === 'Profile') {
              image = UMIcons.navProfileIcon
              color = focused
                ? UMColors.primaryOrange : UMColors.black
              width = 23;
              height = 25;  
            }
            return <Image source={image} style={{width: width, height: height, marginTop:'5%', marginBottom: '3%', tintColor: color}} />;
          },
          tabBarActiveTintColor: UMColors.primaryOrange,
          tabBarInactiveTintColor: UMColors.black,
          shifting: true,
          headerShown: false,
          tabBarLabel:() => {return null},
          tabBarStyle: {
            height: '8%',
            borderTopColor: UMColors.black,
            backgroundColor: UMColors.BGOrange,
            shadowColor: '#171717',
            shadowOffset: {height: -3},
            shadowOpacity: 0.3,
          } 
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{ gestureEnabled: false }}/>
        <Tab.Screen name="Calendar" component={Calendar} options={{ gestureEnabled: false }}/>
        <Tab.Screen name="Messages" component={Messages} options={{ gestureEnabled: false }}/>
        <Tab.Screen name="Notification" component={Notification} options={{ gestureEnabled: false, tabBarButton: () => null }}/>
        <Tab.Screen name="Profile" component={Profile} options={{ gestureEnabled: false }}/>
      </Tab.Navigator>
    );
}