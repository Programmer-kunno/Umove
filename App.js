import React, { Component } from 'react';
import { View } from 'react-native';
import RootNavigation from './src/pages/Navigation/RootNavigation';

import { Provider } from 'react-redux';
import { store } from './src/redux/store';

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});


export default class App extends Component{
  render() {
    return (
      <View style={{flex: 1}}>
        <Provider store={store}>
          <RootNavigation/>
        
        </Provider>
      </View>
    )
  }
}
