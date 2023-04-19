import { View, Text, SafeAreaView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import GrayNavbar from '../../Components/GrayNavbar'
import { UMIcons } from '../../../utils/imageHelper'
import { useSelector } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { navigate } from '../../../utils/navigationHelper'
import { dispatch } from '../../../utils/redux'
import { saveUserChanges } from '../../../redux/actions/User'

const deviceWidth = Dimensions.get('screen').width

export default UserProfileScreen = (props) => {

  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  console.log(userChangesData)
  const fullname = userChangesData?.userDetails?.firstName + ' ' + 
                   userChangesData?.userDetails?.lastName
  const username = userChangesData?.userDetails?.username
  const email = userChangesData?.userDetails?.email
  const mobileNumber = userChangesData?.userDetails?.mobileNumber
  const legalAddress = userChangesData?.userDetails?.address + ' ' +
                       userChangesData?.userDetails?.barangay + ' ' +
                       userChangesData?.userDetails?.city + ' ' +
                       userChangesData?.userDetails?.province + ', ' +
                       userChangesData?.userDetails?.zipCode

  return (
    <SafeAreaView style={styles.mainContainer}>
      <GrayNavbar
        Title={'User Profile'}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: deviceWidth }} contentContainerStyle={{ alignItems: 'center' }}>
        <View style={[styles.detailsContainer, { marginTop: 20 }]}>
          <Text style={styles.detailsTitle}>Name</Text>
          <Text style={styles.detailsValue}>{fullname}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditName', { 
                  firstName: userChangesData?.userDetails?.firstName,
                  middleName: userChangesData?.userDetails?.middleName,
                  lastName: userChangesData?.userDetails?.lastName 
                })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Username</Text>
          <Text style={styles.detailsValue}>{username}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditUsername', {
                username: username
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Email Address</Text>
          <Text style={styles.detailsValue}>{email}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditEmail', {
                email: email
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Mobile Number</Text>
          <Text style={styles.detailsValue}>{mobileNumber}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditMobileNumber', {
                mobileNumber: mobileNumber
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Billing / Legal Address</Text>
          <Text style={styles.detailsValue}>{legalAddress}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditAddress', {
                address: userChangesData?.userDetails?.address,
                barangay: userChangesData?.userDetails?.barangay,
                city: userChangesData?.userDetails?.city,
                province: userChangesData?.userDetails?.province,
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.detailsContainer, { marginBottom: 50}]}>
          <Text style={styles.detailsTitle}>Valid ID</Text>
          {
            userChangesData?.userDetails?.validID ?
              <Image
                style={styles.idImage}
                source={{ uri: userChangesData?.userDetails?.validID }}
                resizeMode='contain'
              />
            :
              <Text style={styles.noValidIDTxt}>No Valid ID</Text>
          }
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditValidID', {
                validID: userChangesData?.userDetails?.validID
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.saveBtn}
      >
        <Text style={styles.saveBtnTxt}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  detailsContainer: {
    borderRadius: 7,
    marginTop: 10,
    width: deviceWidth / 1.15,
    height: 'auto',
    justifyContent: 'center',
    borderColor: UMColors.black,
    backgroundColor: UMColors.BGOrange,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 14,
    color: UMColors.black,
    marginBottom: 6,
    marginLeft: 13,
    marginTop: 15
  },
  detailsValue: {
    fontSize: 14,
    color: UMColors.primaryOrange,
    fontWeight: 'bold',
    marginLeft: 13,
    marginBottom: 15
  },
  editIcon: {
    width: 13,
    height: 13,
    tintColor: UMColors.primaryOrange
  },
  idImage: {
    width: '60%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 10
  },
  editBtn: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10
  },
  noValidIDTxt: {
    color: UMColors.primaryGray,
    width: '60%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  saveBtn: {
    width: '45%',
    height: 40,
    backgroundColor: UMColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    bottom: 40,
    elevation: 7
  },
  saveBtnTxt: {
    color: UMColors.white,
    fontSize: 15,
    fontWeight: 'bold'
  }
})