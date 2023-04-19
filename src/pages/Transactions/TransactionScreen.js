import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import { UMColors } from '../../utils/ColorHelper'
import { UMIcons } from '../../utils/imageHelper'
import { navigate } from '../../utils/navigationHelper'
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal'
import GrayNavbar from '../Components/GrayNavbar'
import { Loader } from '../Components/Loader'
import TransactionTabs from './TransactionTabs'

const Transactions = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <GrayNavbar
        Title={'Transactions'}
        rightBtnImage={UMIcons.downloadIcon}
        onRightPress={() => {

        }}
      />
      <TransactionTabs />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false) }
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false) }>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalRow}>
                <TouchableOpacity style={styles.alignItemCenter}
                  onPress={() => {
                    setModalVisible(false)
                    navigate('BookingItemScreen', { bookingType: 'Exclusive' })
                  }}
                  >
                  <Image source={require('../../assets/truck/exclusive.png')} style={styles.exclusiveTruck}/>
                  <View style={[styles.button, styles.modalButton]}>
                    <Text style={styles.textStyle}>Exclusive</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alignItemCenter}
                  onPress={() => {
                    setModalVisible(false)
                    navigate('BookingItemScreen', { bookingType: 'Shared' })
                  }}
                >
                  <Image source={require('../../assets/truck/shared.png')} style={styles.sharedTruck}/>
                  <View style={[styles.button, styles.modalButton]}>
                    <Text style={styles.textStyle}>Shared</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.bookButtonContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Create New Booking</Text>
        </TouchableOpacity>
      </View>
      <Loader/>
      <ErrorWithCloseButtonModal/>
    </View>
  )
}

export default Transactions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UMColors.BGOrange
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "30%"
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  exclusiveTruck: {
    width: 100,
    height: 45
  },
  modalButton: {
    backgroundColor: "rgb(223,131,68)",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 15,
    marginBottom: -10
  },
  sharedTruck: {
    width: 90,
    height: 45
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15
  },
  bookButtonContainer: {
    paddingHorizontal: 20, 
    paddingBottom: 40, 
    paddingTop: 10
  },
  bookButton: {
    width: '100%', 
    backgroundColor: UMColors.primaryOrange, 
    paddingVertical: 20, 
    alignItems: 'center', 
    borderRadius: 20
  },
   bookButtonText: {
    fontSize: 20, 
    color: UMColors.white
  }
})