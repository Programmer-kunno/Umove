import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { UMColors } from '../../utils/ColorHelper'
import { UMIcons } from '../../utils/imageHelper'
import { useSelector } from 'react-redux'
import { dispatch } from '../../utils/redux'
import { showError } from '../../redux/actions/ErrorModal'

export default ErrorWithCloseButtonModal = () => {
  const error = useSelector(state => state.showErrorReducer.showError)
  
  if(!error) return;

  return (
    <Modal
      transparent={true}
      visible={true}
      animationType='none'
      statusBarTranslucent
    >
      <View style={styles.mdlBGContainer}>
        <View style={styles.mdlContainer}>
          <TouchableOpacity
            style={styles.mdlCloseBtn}
            onPress={() => {
              dispatch(showError(false))
            }}
          >
            <Image
              style={{height: 18, width: 18,}}
              source={UMIcons.xIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Image
            style={{height: 70, width: 70,}}
            source={UMIcons.warningSign}
            resizeMode={'contain'}
          />
          <Text style={[styles.errorText, { marginTop: '8%'}]}>Cannot connect to the Server</Text>
          <Text style={styles.errorText}>Please Try Again</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  mdlBGContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlContainer: {
    width: '80%',
    height: '28%',
    borderRadius: 10,
    backgroundColor: UMColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10
  },
  mdlCloseBtn: {
    position: 'absolute',
    top: 18,
    right: 18
  },
  errorText: {
    width: '80%',
    marginTop: '2%',
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center'
  },
  okBtnTxt: {
    color: UMColors.primaryOrange,
    fontSize: 18,
    fontWeight: 'bold'
  }
})
