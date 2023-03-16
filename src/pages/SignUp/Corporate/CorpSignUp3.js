import React, { Component }  from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable'
import ImagePicker from 'react-native-image-crop-picker';
import { FetchApi }  from '../../../api/fetch'
import { emailRegex, mobileNumberRegex } from '../../../utils/stringHelper';
import { UMColors } from '../../../utils/ColorHelper';

export default class CorpSignUp3 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      register: this.props.route.params.register,
      error: false,
      errMessage: "",
      companyTypeList: [],
      permission: ""
    };
    
    this.scrollView = null
  }

  async componentDidMount() {
    this.init();
    this.loadComapnyType();
  }

  async init() {
    this.setState({ register: this.props.route.params.register })
    console.log(this.state.register)
  }

  async signUp() {
    let register = this.state.register;
    if(!emailRegex(register.companyEmail)) {
      this.setState({ error: true, errMessage: "Please enter a valid email" });
    } 
    else if(!mobileNumberRegex(register.companyMobileNumber)) {
      this.setState({ error: true, errMessage: "Please enter a valid contact number" });
    } else {
      this.props.navigation.navigate('CorpSignUp4', {
        register: this.state.register
      })
    }
  }

  async loadComapnyType() {
    let response = await FetchApi.companyTypes()
    console.log(response.data)
    if(response.success) {
      let companyTypeList = response.data
      this.setState({companyTypeList})
    } else {
      console.log(response.message)
    }
  }

  async selectCompanyLogo() {
    try {
      let register = this.state.register
      const OsVer = Platform.constants['Release']
      if(OsVer <= 12){
        const data = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
        this.setState({ permission: data })
      } else {
        const data = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        this.setState({ permission: data })
      }
      if (this.state.permission === "granted") {
        ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true
        }).then(image => {
          console.log(image);
          let result = image
          let filename = result.path.substring(result.path.lastIndexOf('/') + 1, result.path.length);
          result.name = filename
          register.companyLogo = result
          this.setState({register})
        }).catch(err => {
          console.log(err)
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    let register = this.state.register;
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>   
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo/logo-primary.png')}
            style={styles.logo}
            resizeMode={'contain'}
          />
          {this.state.error && <View style={styles.errorContainer}><Text style={styles.errorMessage}>{this.state.errMessage}</Text></View>}
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.text}>Company Profile</Text>
          <View style={styles.inputContainer}>        
            {/* Company Name */}
            <TextInput
              style={[styles.fullWidthInput]}
              onChangeText={(val) => {
                register.companyName = val;
                this.setState({register})
              }}
              placeholder='Company Name'
              placeholderTextColor={'#808080'}
            />
          </View>

          {/* Company Email */}
          <View style={styles.inputContainer}>                        
            <TextInput
              importantForAutofill='no'
              style={[styles.fullWidthInput]}
              keyboardType='email-address'
              onChangeText={(val) => {
                register.companyEmail = val;
                this.setState({register: register, error1: false})
              }}
              placeholder='Company Email Address'
              placeholderTextColor={'#808080'}
            />
          </View>

          {/* Company Mobile Number */}
          <View style={styles.inputContainer}>                    
            <TextInput
              style={[styles.fullWidthInput]}
              keyboardType='number-pad'
              onChangeText={(val) => {
                register.companyMobileNumber = val;
                this.setState({register})
              }}
              placeholder='Company Mobile Number'
              placeholderTextColor={'#808080'}
              maxLength={11}
            />
          </View>

          {/* Company Address */}
          <View style={styles.inputContainer}>                
            <TextInput
              style={[styles.fullWidthInput]}
              onChangeText={(val) => {
                register.companyAddress = val;
                this.setState({register})
              }}
              placeholder='Building Name, Block, Lot, Street'
              placeholderTextColor={'#808080'}
              />
          </View>

          {/* Company Type */}
          <View style={[styles.inputContainer, styles.row]}>
            <ModalSelector
              data={this.state.companyTypeList}
              keyExtractor= {companyType => companyType.id}
              labelExtractor= {companyType => companyType.type_name}
              initValue="Select Company Type"
              onChange={(companyType) => {
                register.companyType = companyType.id;
                this.setState({register});
              }} 
              searchText={'Search'}
              cancelText={'Cancel'}
              style={styles.fullWidthInput}
              initValueTextStyle={styles.initValueTextStyle}
              searchStyle={styles.searchStyle}
              selectStyle={styles.selectStyle1}
              selectTextStyle={styles.selectTextStyle}
              sectionTextStyle={styles.sectionTextStyle}
              cancelStyle={styles.cancelStyle}
              cancelTextStyle={styles.cancelTextStyle}
              overlayStyle={styles.overlayStyle}
              touchableActiveOpacity={styles.touchableActiveOpacity}
            />
          </View>

          <View style={styles.uploadContainer}>
            <Text style={styles.text}>
              Company Logo
            </Text>
            <TouchableOpacity style={[styles.uploadButton]} onPress={() => this.selectCompanyLogo()}>
              <View style={styles.uploadFileName}>
                { register.companyLogo == null ?
                  <Text style={styles.uploadFileNameText}>  Upload File </Text>
                :
                  <Text numberOfLines={1} style={styles.uploadFileNameText}> {register.companyLogo.name} </Text>
                }
              </View>
              <View style={styles.uploadButtonColor}>
                <Text style={styles.uploadButtonText}>Upload</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          {/* Make button gray when not all inputs are filled out, orange when filled out */}
          { register.companyLogo == null || register.companyName == '' || register.companyType == '' || register.companyEmail == '' || register.companyMobileNumber == '' || register.companyAddress == '' ?
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
      </TouchableWithoutFeedback>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange,
  },
  logoContainer: {
    height: '20%',
    width : '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '50%',
    width: '90%',
  },
  row: {
    flexDirection: 'row',
  },
  bodyContainer: {
    width: '90%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%'
  },
  text: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold'
  }, 
  fullWidthInput: {
    backgroundColor: 'white',
    width: '90%',
    height: '90%',
    borderRadius: 25,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
    paddingLeft: '5%',
    justifyContent: 'center'
  },
  regionInput: {
    width: '62%',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    marginLeft: '3%'
  },
  initValueTextStyle: {
    fontSize: 14,
    color: "#808080"
  },
  searchStyle: {
    borderColor: 'black',
    height: 40,
    marginTop: '5%'
  },
  selectStyle1: {
    backgroundColor: 'white',
    width: '95%',
    height: '95%',
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectTextStyle: {
    fontSize: 14,
    color: 'black'
  },
  sectionTextStyle: {
    fontSize: 18,
    fontWeight: '500'
  },
  cancelStyle: {
    justifyContent: 'center',
    height: 50,
  },
  cancelTextStyle: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500'
  },
  overlayStyle: {
    flex: 1, 
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  nextButtonGray: {
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5
  },
  nextButtonOrange: {
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
    elevation: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
  uploadContainer: {
    backgroundColor: 'white',
    width: '90%',
    marginTop: '6%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '40%',
    marginTop: '3%'
  },
  uploadFileName: {
    backgroundColor: UMColors.ligthGray,
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
    backgroundColor: UMColors.primaryOrange,
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
  nextButtonContainer: {
    height: '10%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer:{
    width: '90%',
    height: '20%',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    position: 'absolute',
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage:{
    textAlign: 'center',
    color: '#d32f2f'
  }
})