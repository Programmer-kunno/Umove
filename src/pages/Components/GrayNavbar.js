import { Text, View, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native'
import React, { Component } from 'react'
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { goBack } from '../../utils/navigationHelper';

export default class GrayNavbar extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <View style={styles.headerContainer}>
        <StatusBar barStyle={'light-content'}/>
        <View style={styles.headerItems}>
          <TouchableOpacity
            style={styles.headerBackBtn}
            onPress={() => {
                if(this.props.onGoBack) {
                  this.props.onGoBack()
                } else {
                  goBack()
                }
              }
            }
          >
            <Image
              style={{height: '60%'}}
              source={UMIcons.backIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{this.props.Title}</Text>

          <TouchableOpacity
            style={styles.rightBtn}
            disabled={this.props.rightBtnImage ? false : true}
            onPress={() => {
              this.props.onRightPress()
            }}
          > 
          { this.props.rightBtnImage &&
            <Image
              style={{height: '100%'}}
              source={this.props.rightBtnImage}
              resizeMode={'contain'}
            />
          }
          </TouchableOpacity>
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
    width: '100%',
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: UMColors.white,
    fontSize: 22,
  },
  headerBackBtn: {
    height: 30,
    width: 30,
    marginHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  rightBtn: {
    height: 30,
    width: 30,
    marginHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
