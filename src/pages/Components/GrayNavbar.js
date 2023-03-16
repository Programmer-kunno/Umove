import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { Component } from 'react'
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';

export default class GrayNavbar extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerItems}>
          <TouchableOpacity
            style={styles.headerBackBtn}
            onPress={() => {
              this.props.onBack()
            }}
          >
            <Image
              style={{height: '60%'}}
              source={UMIcons.backIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{this.props.Title}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: '11%',
    paddingTop: '10%',
    backgroundColor: 'rgb(29, 32, 39)', 
  },
  headerItems: {
    height: '60%',
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: UMColors.white,
    fontSize: 22,
  },
  headerBackBtn: {
    height: '60%',
    marginHorizontal: '5%',
    justifyContent: 'center'
  }
})
