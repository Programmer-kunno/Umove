import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'

export default class ConfirmationModal extends Component {
  render() {
    return(
      <Modal
        visible={this.props.visible}
        animationType='none'
        statusBarTranslucent
        transparent={true}
      >
        <View style={styles.mainMdlContainer}>
          <View style={styles.mdlContainer}>
            <View style={styles.mdlTxtContainer}>
              <Text style={styles.mdlTxt}>{this.props.message}</Text>
            </View>
            <View style={styles.mdlBtnContainer}>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  this.props.onYes()
                }}
              >
                <Text style={styles.mdlBtnTxt}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  this.props.onNo()
                }}
              >
                <Text style={styles.mdlBtnTxt}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  mainMdlContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlContainer: {
    width: '80%',
    height: '25%',
    backgroundColor: 'rgb(27, 32, 39)',
    borderRadius: 15,
    alignItems: 'center',
  },
  mdlTxtContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  mdlTxt: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center'
  },
  mdlBtnContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mdlBtn: {
    width: '35%',
    backgroundColor: 'white',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginHorizontal: 10
  },
  mdlBtnTxt: {
    fontSize: 16,
    color: 'black'
  }
})
