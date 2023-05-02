import { Text, View, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native'
import React, { Component } from 'react'
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { goBack } from '../../utils/navigationHelper';

export default class CustomNavbar extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <View style={[styles.headerContainer, { backgroundColor: this.props.ColorChange || UMColors.darkerGray }]}>
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
              style={{height: '60%', tintColor: this.props.ChangeBackColor || UMColors.white}}
              source={UMIcons.backIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: this.props.ChangeTitleColor || UMColors.white }]}>{this.props.Title}</Text>

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
    fontSize: 20,
  },
  headerBackBtn: {
    height: 30,
    width: 30,
    marginHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  rightBtn: {
    height: 25,
    width: 25,
    marginHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
