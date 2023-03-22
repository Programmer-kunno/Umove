import { Text, View, StyleSheet, Image } from 'react-native'
import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { UMIcons } from '../../utils/imageHelper'
import { finishTask } from '../../utils/taskManagerHelper'
import { navigate } from '../../utils/navigationHelper'

export default class NavbarComponent extends Component {
  constructor(props){
    super(props)

  }

  render() {
    return (
      <View style={styles.headerContainer}>           
        <View style={styles.headerBackContainer}>
          <TouchableOpacity
            style={styles.headerBackBtn}
            onPress={() => {
              this.props.goBack()
            }}
          >
            <Image
              style={{width: 50}}
              source={UMIcons.backIconOrange}
              resizeMode={'contain'}
            />
          </TouchableOpacity>          
        </View>
        
        <Image
          style={styles.headerLogo}
          source={UMIcons.mainLogo}
          resizeMode={'contain'}
        />  
      </View>
    )
  }
}``

const styles = StyleSheet.create({
  headerContainer: {
    height: '10%',
    marginTop: '10%',
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  headerBackContainer: {
    width: '15%',
    height: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerBackBtn: {

  },
  headerLogo: {
    width: '40%',
    borderWidth: 1,
  },
})

