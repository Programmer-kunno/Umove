import React, { Component, useEffect, useState }  from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  PermissionsAndroid,
  Platform,
  Dimensions
} from 'react-native';
import DocumentPicker from 'react-native-document-picker'
import getPath from '@flyerhq/react-native-android-uri-path';
import { TextSize, normalize } from '../../../utils/stringHelper';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import { navigate } from '../../../utils/navigationHelper';

const deviceWidth = Dimensions.get('screen').width

export default SignUpScreen3 = (props) => {  
  const [registerData, setRegisterData] = useState({})

  useEffect(() => {
    setRegisterData(props.route?.params?.register)
    console.log(props.route?.params?.register)
  }, [])

  const signUpNext = () => {
    navigate('SignUpScreen4', { register: registerData })
  }

  const selectBIRFile = async() => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      const origPath = getPath(response[0].uri)
      const fileOrigPath = Platform.OS === 'ios' ? origPath : `file://${origPath}`
      setRegisterData({ ...registerData, bir: { uri: fileOrigPath, name: response[0].name, type: response[0].type }})
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  const selectDTIFile = async() => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const origPath = getPath(response[0].uri)
      const fileOrigPath = Platform.OS === 'ios' ? origPath : `file://${origPath}`
      setRegisterData({ ...registerData, dti: { uri: fileOrigPath, name: response[0].name, type: response[0].type }})
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  const selectValidId = async() => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const origPath = getPath(response[0].uri)
      const fileOrigPath = Platform.OS === 'ios' ? origPath : `file://${origPath}`
      setRegisterData({ ...registerData, validId: { uri: fileOrigPath, name: response[0].name, type: response[0].type }})
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  const checkIsEmptyInputs = () => {
    if( registerData.bir == undefined || registerData.dti == undefined || registerData.validId == undefined ){
      return true 
    } else {
      return false
    }
  }

  const renderBody = () => {
    return(
      <View style={styles.documentContainer}>
        <Text style={styles.documentTitle}>BIR</Text>
        <TouchableOpacity 
          style={styles.documentBtn}
          onPress={() => {
            selectBIRFile()
          }}
        >
          <Image
            style={{ width: '90%', height: registerData.bir ? '90%' : '70%' }}
            source={registerData.bir ? { uri: registerData.bir?.uri } : UMIcons.uploadWithText}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <Text style={styles.documentTitle}>DTI/SEC</Text>
        <TouchableOpacity 
          style={styles.documentBtn}
          onPress={() => {
            selectDTIFile()
          }}
        >
          <Image
            style={{ width: '90%', height: registerData.dti ? '90%' : '70%'  }}
            source={registerData.dti ? { uri: registerData.dti?.uri } : UMIcons.uploadWithText}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <Text style={styles.documentTitle}>Valid ID</Text>
        <TouchableOpacity 
          style={styles.documentBtn}
          onPress={() => {
            selectValidId()
          }}
        >
          <Image
            style={{ width: '90%', height: registerData.validId ? '90%' : '70%'  }}
            source={registerData.validId ? { uri: registerData.validId.uri } : UMIcons.uploadWithText}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>
    )
  }

  return(
    <View style={styles.mainContainer}>
      {/* Logo */}
      <View style={styles.upperContainer}>
        <Image
          source={require('../../../assets/logo/logo-primary.png')}
          style={styles.logo}
          resizeMode={'contain'}
        />
        <Text style={styles.upperContainerTitle}>Upload Document</Text>
      </View>

      {renderBody()}

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        {/* Make button gray when not all inputs are filled out, orange when filled out */}
        <TouchableOpacity 
          style={[styles.nextButton, !checkIsEmptyInputs() && {backgroundColor: UMColors.primaryOrange}]} 
          disabled={checkIsEmptyInputs()}
          onPress={() => signUpNext()}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange,
  },
  upperContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16%',
  },
  logo: {
    height: 60,
    width: '80%',
  },
  upperContainerTitle: {
    fontSize: normalize(TextSize('L')),
    color: 'black',
    marginVertical: 10
  },
  bodyContainer: {
    width: deviceWidth,
  },
  text: {
    fontSize: normalize(15),
    color: 'black',
    fontWeight: 'bold'
  }, 
  nextButton: {
    height: 45,
    width: '70%',
    borderRadius: 25,
    marginTop: 15,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5
  },
  nextButtonText: {
    color: 'white',
    fontSize: normalize(TextSize('Normal')),
    fontWeight:'bold'
  },
  nextButtonContainer: {
    marginTop: 15,
    height: '20%',
    width: '90%',
    alignItems: 'center',
  },
  documentContainer: {
    
  },
  documentTitle: {
    fontSize: normalize(TextSize('Normal')),
    paddingLeft: 10,
    marginTop: 10
  },
  documentBtn: {
    borderWidth: 2,
    borderColor: UMColors.primaryOrange,
    borderRadius: 5,
    width: deviceWidth / 1.25,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UMColors.BGOrange,
    marginBottom: 5,
    elevation: 5
  },
  title: {
    fontSize: normalize(TextSize('L')),
    color: 'black',
    marginBottom: 10,
  },
})