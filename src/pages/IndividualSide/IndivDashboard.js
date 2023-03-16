import React, { Component } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './IndivComponents/Home';
import Calendar from './IndivComponents/Calendar';
import Messages from './IndivComponents/Messages';
import Notification from './IndivComponents/Notification';
import Profile from './IndivComponents/Profile';


const Tab = createBottomTabNavigator();

export default class IndivDashboard extends Component{
  render() {
    return (
      <Tab.Navigator
        initialRoute="Home" 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let image;
            let width;
            let height;
            if (route.name === 'Home') {
              image = focused 
                ? require('../../assets/icons/home-active.png')
                : require('../../assets/icons/home.png')
              width = 22;
              height = 22;              
            } else if(route.name === 'Calendar') {
              image = focused 
                ? require('../../assets/icons/calendar-active.png')
                : require('../../assets/icons/calendar.png')
              width = 22;
              height = 22;
            } else if(route.name === 'Messages') {
              image = focused 
                ? require('../../assets/icons/messages-active.png')
                : require('../../assets/icons/messages.png')
              width = 22;
              height = 22;  
            } else if(route.name === 'Notification') {
              image = focused 
                ? require('../../assets/icons/notificationEmpty-active.png')
                : require('../../assets/icons/notificationEmpty.png')
              width = 24;
              height = 24;  
            } else if(route.name === 'Profile') {
              image = focused 
                ? require('../../assets/icons/profile-active.png')
                : require('../../assets/icons/profile.png')
              width = 20;
              height = 22;  
            }
            return <Image source={image} style={{width: width, height: height, marginTop:'5%', marginBottom: '3%'}} />;
          },
          tabBarActiveTintColor: 'rgb(112, 112, 112)',
          tabBarInactiveTintColor: 'black',
          shifting: true,
          headerShown: false,
          tabBarStyle: {
            borderTopColor: '#1B2027',
            backgroundColor: 'rgb(238, 241, 217)',
            shadowColor: '#171717',
            shadowOffset: {height: -3},
            shadowOpacity: 0.3,
          } 
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{ gestureEnabled: false }}/>
        <Tab.Screen name="Calendar" component={Calendar} options={{ gestureEnabled: false }}/>
        <Tab.Screen name="Messages" component={Messages} options={{ gestureEnabled: false }}/>
        <Tab.Screen name="Notification" component={Notification} options={{ gestureEnabled: false }}/>
        <Tab.Screen name="Profile" component={Profile} options={{ gestureEnabled: false }}/>
      </Tab.Navigator>
    );
  }
}