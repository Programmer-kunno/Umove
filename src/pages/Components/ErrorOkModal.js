import { Text, View, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

import { UMColors } from '../../utils/ColorHelper'
import { UMIcons } from '../../utils/imageHelper'
import { TextSize, normalize } from '../../utils/stringHelper'

export default class ErrorOkModal extends Component {
  render() {
    return (
        <Modal
          transparent={true}
          visible={this.props.Visible}
          animationType='none'
          statusBarTranslucent
        >
          <View style={styles.mdlBGContainer}>
            <View style={styles.mdlContainer}>
              <Image
                style={{height: '27%'}}
                source={UMIcons.cloudErrorIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.errorText}>{this.props.ErrMsg}</Text>
              <TouchableOpacity
                style={{ marginTop: '6%'}}
                onPress={() => {
                  this.props.OkButton()
                }}
              >
                <Text style={styles.okBtnTxt}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    )
  }
}

const styles = StyleSheet.create({
  mdlBGContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlContainer: {
    width: '85%',
    height: '25%',
    borderRadius: 10,
    backgroundColor: UMColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10
  },
  errorText: {
    width: '80%',
    marginTop: '6%',
    fontSize: normalize(TextSize('M')),
    lineHeight: 25,
    textAlign: 'center'
  },
  okBtnTxt: {
    color: UMColors.primaryOrange,
    fontSize: normalize(TextSize('M')),
    fontWeight: 'bold'
  }
})


