import { View, Text, SafeAreaView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import GrayNavbar from '../../Components/GrayNavbar'
import { UMIcons } from '../../../utils/imageHelper'
import { useSelector } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'

const deviceWidth = Dimensions.get('screen').width

export default CompanyProfileScreen = () => {

  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  console.log(userChangesData)
  const companyName = userChangesData?.companyDetails?.companyName
  const companyEmail = userChangesData?.companyDetails?.companyEmail
  const companyMobileNumber = userChangesData?.companyDetails?.companyMobileNumber
  const legalAddress = userChangesData?.companyDetails?.officeAddress + ' ' +
                       userChangesData?.companyDetails?.officeBarangay + ' ' +
                       userChangesData?.companyDetails?.officeCity + ' ' +
                       userChangesData?.companyDetails?.officeProvince + ', ' +
                       userChangesData?.companyDetails?.officeZipCode

  return (
    <SafeAreaView style={styles.mainContainer}>
      <GrayNavbar
        Title={'Company Profile'}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: deviceWidth }} contentContainerStyle={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.editCompanyLogoBtn}
        >
          <Image
            style={styles.idImage}
            source={{ uri: userChangesData?.companyDetails?.companyLogo }}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <View style={[styles.detailsContainer, { marginTop: 20 }]}>
          <Text style={styles.detailsTitle}>Company Name</Text>
          <Text style={styles.detailsValue}>{companyName}</Text>
          <TouchableOpacity
            style={styles.editBtn}
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
          <Text style={styles.detailsValue}>{companyEmail}</Text>
          <TouchableOpacity
            style={styles.editBtn}
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
          <Text style={styles.detailsValue}>{companyMobileNumber}</Text>
          <TouchableOpacity
            style={styles.editBtn}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.detailsContainer, { marginBottom: 20 }]}>
          <Text style={styles.detailsTitle}>Billing / Legal Address</Text>
          <Text style={styles.detailsValue}>{legalAddress}</Text>
          <TouchableOpacity
            style={styles.editBtn}
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
  editCompanyLogoBtn: {
    width: 140,
    height: 140,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    borderRadius: 7,
    marginTop: 20,
    overflow: 'hidden'
  },
  idImage: {
    width: 140,
    height: 140,
    alignSelf: 'center',
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
  editBtn: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10
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