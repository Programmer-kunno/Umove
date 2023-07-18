import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { UMColors } from '../../utils/ColorHelper'
import { TextSize, normalize } from '../../utils/stringHelper'

export default OrangeConfirmationModal= (props) => {
  const { visible, message } = props

  return(
    <Modal
      visible={visible}
      animationType='none'
      statusBarTranslucent
      transparent={true}
    >
      <View style={styles.mainMdlContainer}>
        <View style={styles.mdlContainer}>
          <View style={styles.mdlTxtContainer}>
            <Text style={styles.mdlTxt}>{message}</Text>
          </View>
          <View style={styles.mdlBtnContainer}>
            <TouchableOpacity
              onPress={() => {
                props.onYes()
              }}
            >
              <Text style={[styles.mdlBtnTxt, { color: UMColors.primaryOrange }]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.onNo()
              }}
            >
              <Text style={[styles.mdlBtnTxt, { color: UMColors.red }]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
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
    height: 180,
    backgroundColor: UMColors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  mdlTxtContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  mdlTxt: {
    color: UMColors.black,
    fontSize: normalize(TextSize('M')),
    paddingHorizontal: 20,
    lineHeight: 30,
    fontWeight: '400',
    textAlign: 'center'
  },
  mdlBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between'
  },
  mdlBtnTxt: {
    fontSize: normalize(TextSize('Normal')),
    fontWeight: 'bold'
  }
})
