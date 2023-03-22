import React, { Component }  from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  PermissionsAndroid
} from 'react-native';
import DocumentPicker from 'react-native-document-picker'
import getPath from '@flyerhq/react-native-android-uri-path';


export default class SignUpScreen5 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      register: this.props.route?.params?.register,
    };
  }

  async signUp() {
      this.props.navigation.navigate('SignUpScreen6', {
        register: this.state.register
      })
  }

  async selectBIRFile() {
    try {
      let register = this.state.register
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      const origPath = getPath(response[0].uri)
      const fileOrigPath = `file://${origPath}`
      response[0].uri = fileOrigPath
      register.bir = response[0]
      this.setState({register})
      console.log(this.state.register)
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  async selectDTIFile() {
    try {
      let register = this.state.register
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      const origPath = getPath(response[0].uri)
      const fileOrigPath = `file://${origPath}`
      response[0].uri = fileOrigPath
      register.dti = response[0]
      this.setState({register})
      console.log(this.state.register)
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  async selectValidId() {
    console.log(this.state.register)
    try {
      let register = this.state.register
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const origPath = getPath(response[0].uri)
      const fileOrigPath = `file://${origPath}`
      response[0].uri = fileOrigPath
      register.validId = response[0]
      this.setState({register})
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  render() {
    let register = this.state.register;
    return(
      <View style={styles.mainContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo/logo-primary.png')}
            style={styles.logo}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.bodyContainer}>
          {/* Header */}
          <Text style={styles.headerText}>Document Upload</Text>
          {/* BIR */}
          <View style={[styles.uploadContainer]}>
            <Text style={styles.text}>
              BIR Cert. of Registration (Form 2303):
            </Text>
            <TouchableOpacity style={[styles.uploadButton]} onPress={() => this.selectBIRFile()}>
              <View style={styles.uploadFileName}>
                { register.bir == null ?
                  <Text style={styles.uploadFileNameText}>  Upload File </Text>
                :
                  <Text numberOfLines={1} style={styles.uploadFileNameText}> {register.bir.name} </Text>
                }
              </View>
              <View style={styles.uploadButtonColor}>
                <Text style={styles.uploadButtonText}>Upload</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* DTI */}
          <View style={styles.uploadContainer}>
            <Text style={styles.text}>
              DTI / SEC
            </Text>
            <TouchableOpacity style={[styles.uploadButton]} onPress={() => this.selectDTIFile()}>
              <View style={styles.uploadFileName}>
                { register.dti == null ?
                  <Text style={styles.uploadFileNameText}>  Upload File </Text>
                :
                  <Text numberOfLines={1} style={styles.uploadFileNameText}> {register.dti.name} </Text>
                }
              </View>
              <View style={styles.uploadButtonColor}>
                <Text style={styles.uploadButtonText}>Upload</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Valid ID */}
          <View style={styles.uploadContainer}>
            <Text style={styles.text}>
              Valid ID (UMID, Driver's License, Passport)
            </Text>
            <TouchableOpacity style={[styles.uploadButton]} onPress={() => this.selectValidId()}>
              <View style={styles.uploadFileName}>
                { register.validId == null ?
                  <Text style={styles.uploadFileNameText}>  Upload File </Text>
                :
                  <Text numberOfLines={1} style={styles.uploadFileNameText}> {register.validId.name} </Text>
                }
              </View>
              <View style={styles.uploadButtonColor}>
                <Text style={styles.uploadButtonText}>Upload</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.uploadButtonContainer}>
        {/* Next Button */}
          {/* Make button gray when not all inputs are filled out, orange when filled out */}
          { register.bir == null || register.dti == null || register.validId == null ?
          <TouchableOpacity style={styles.nextButtonGray} disabled={true}>
            <Text style={styles.buttonText}> NEXT </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.nextButtonOrange} onPress={() => this.signUp() }>
            <Text style={styles.buttonText}> NEXT </Text>
          </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(238, 241, 217)',
  },
  alignItemCenter: {
    alignItems: 'center'
  },
  logoContainer: {
    width: '90%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '50%',
    width: '100%',
  },
  bodyContainer: {
    height: '60%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold'
  }, 
  uploadContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    marginTop: '5%'
  },
  uploadButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '35%',
    marginTop: '5%',
    marginBottom: '7%',
  },
  uploadFileName: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '60%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#676767',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  uploadFileNameText: {
    paddingLeft: 5,
    color: 'rgb(132, 134, 148)'
  },
  uploadButtonColor: {
    backgroundColor: 'rgb(223,131,68)',
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#676767',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  uploadButtonText: {
    color: 'white'
  },
  text: {
    fontSize: 15,
    color: 'rgb(132, 134, 148)',
    marginTop: '7%'
  },
  uploadButtonContainer: {
    width: '90%',
    height: "10%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextButtonGray: {
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    elevation: 5
  },
  nextButtonOrange: {
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    elevation: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
})