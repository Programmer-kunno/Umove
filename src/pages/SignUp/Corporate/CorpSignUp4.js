import React, { Component }  from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable'
import { FetchApi }  from '../../../api/fetch'

import { UMColors } from '../../../utils/ColorHelper';

export default class CorpSignUp4 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      register: this.props.route.params.register,
      regionList: [],
      provinceList: [],
      cityList: [],
      barangayList: [],
    };
  }

  async componentDidMount() {
    this.init();
    this.loadRegion();
  }

  async init() {
    this.setState({ register: this.props.route.params.register })
    console.log(this.state.register)
  }

  async signUp() {
      this.props.navigation.navigate('CorpSignUp5', {
        register: this.state.register
      })
    }

  async loadRegion() {
    let response = await FetchApi.regions()
    if(response.success) {
      let regionList = response.data
      this.setState({regionList})
    } else {
      console.log(response.message)
    }
  }

  async loadProvince(regionCode) {
    let response = await FetchApi.provinces(regionCode)
    if(response.success) {
      let provinceList = response.data
      this.setState({provinceList})
    } else {
      console.log(response.message)
    }
  }

  async loadCity(provinceCode) {
    let response = await FetchApi.cities(provinceCode)
    if(response.success) {
      let cityList = response.data
      this.setState({cityList})
    } else {
      console.log(response.message)
    }
  }

  async loadBarangay(cityCode) {
    let response = await FetchApi.barangays(cityCode)
    if(response.success) {
      let barangayList = response.data
      this.setState({barangayList})
    } else {
      console.log(response.message)
    }
  }

  render() {
    let register = this.state.register;
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.mainContainer}>
          {/* Logo */}
          <View style={styles.upperContainer}>
            <Image
              source={require('../../../assets/logo/logo-primary.png')}
              style={styles.logo}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.bodyContainer}>
            <View style={[styles.inputContainer]}>
              {/* Header */}
              <Text style={styles.text}>
                Office Address
              </Text>
              
                {/* Street Address */}
                <TextInput
                  style={[styles.fullWidthInput]}
                  onChangeText={(val) => {
                    register.officeAddress = val;
                    this.setState({register})
                  }}
                  placeholder='House No., Lot, Street'
                  placeholderTextColor={'#808080'}
                />
            </View>
            
            {/* Region and Zip Code */}
            <View style={[styles.inputContainer, styles.marginTop, styles.row]}>
              {/* Region */}
              <ModalSelector
                data={this.state.regionList}
                keyExtractor= {region => region.code}
                labelExtractor= {region => region.name}
                initValue="Select Region"
                onChange={(region) => {
                  register.officeRegion = region.name;
                  this.setState({register}, async () => {
                    await this.loadProvince(region.code);
                  });
                }}  
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.regionInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.selectStyle2}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
                touchableActiveOpacity={styles.touchableActiveOpacity}
              />
              {/* ZIP Code */}
              <TextInput
                  style={[styles.zipInput]}
                  onChangeText={(val) => {
                    register.officeZipcode = val;
                    this.setState({register})
                  }}  
                  placeholder='ZIP Code'
                  placeholderTextColor={'#808080'}                        
                  keyboardType='number-pad'
                  returnKeyType='done'
                  maxLength={4}
                />
            </View>

            {/* Province */}
            <View style={[styles.inputContainer, styles.marginTop]}>
              { register.region !== '' ? 
                <ModalSelector
                  data={this.state.provinceList}
                  keyExtractor= {province => province.code}
                  labelExtractor= {province => province.name}
                  initValue="Select Province"
                  onChange={(province) => {
                    register.officeProvince = province.name;
                    this.setState({register}, async () => {
                      await this.loadCity(province.code);
                    });
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
                :
                <ModalSelector
                  disabled={true}
                  data={this.state.provinceList}
                  initValue="Select Province"
                  searchText={'Search'}
                  cancelText={'Cancel'}
                  style={styles.disabledFullWidthInput}
                  initValueTextStyle={styles.initValueTextStyle}
                  searchStyle={styles.searchStyle}
                  selectStyle={styles.disabledSelectStyle}
                  selectTextStyle={styles.selectTextStyle}
                  sectionTextStyle={styles.sectionTextStyle}
                  cancelStyle={styles.cancelStyle}
                  cancelTextStyle={styles.cancelTextStyle}
                  overlayStyle={styles.overlayStyle}
                  touchableActiveOpacity={styles.touchableActiveOpacity}
                />
              }
            </View>

            {/* City */}
            <View style={[styles.inputContainer, styles.marginTop]}>
              { register.province !== '' ?
                <ModalSelector
                  data={this.state.cityList}
                  keyExtractor= {city => city.code}
                  labelExtractor= {city => city.name}
                  initValue="Select City"
                  onChange={(city) => {
                    register.officeCity = city.name;
                    this.setState({register}, async () => {
                      await this.loadBarangay(city.code);
                    });
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
                />
                :
                <ModalSelector
                  disabled={true}
                  initValue="Select City"
                  searchText={'Search'}
                  cancelText={'Cancel'}
                  style={styles.disabledFullWidthInput}
                  initValueTextStyle={styles.initValueTextStyle}
                  searchStyle={styles.searchStyle}
                  selectStyle={styles.disabledSelectStyle}
                  selectTextStyle={styles.selectTextStyle}
                  sectionTextStyle={styles.sectionTextStyle}
                  cancelStyle={styles.cancelStyle}
                  cancelTextStyle={styles.cancelTextStyle}
                  overlayStyle={styles.overlayStyle}
                  touchableActiveOpacity={styles.touchableActiveOpacity}
                />
              }
            </View>

            {/* Barangay */}
            <View style={[styles.inputContainer, styles.marginTop]}>
              { register.city !== '' ? 
                <ModalSelector
                  data={this.state.barangayList}
                  keyExtractor= {barangay => barangay.code}
                  labelExtractor= {barangay => barangay.name}
                  initValue="Select Barangay"
                  onChange={(barangay) => {
                    register.officeBarangay = barangay.name;
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
                />
                :
                <ModalSelector
                  disabled={true}
                  initValue="Select Barangay"
                  searchText={'Search'}
                  cancelText={'Cancel'}
                  style={styles.disabledFullWidthInput}
                  initValueTextStyle={styles.initValueTextStyle}
                  searchStyle={styles.searchStyle}
                  selectStyle={styles.disabledSelectStyle}
                  selectTextStyle={styles.selectTextStyle}
                  sectionTextStyle={styles.sectionTextStyle}
                  cancelStyle={styles.cancelStyle}
                  cancelTextStyle={styles.cancelTextStyle}
                  overlayStyle={styles.overlayStyle}
                  touchableActiveOpacity={styles.touchableActiveOpacity}
                />
              }
            </View>
          </View>         

          <View style={styles.bottomBtnContainer}>
          {/* Next Button */}
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            { register.officeAddress == '' || register.officeRegion == '' || register.officeProvince == '' || register.officeRegion == '' || register.officeBarangay == '' || register.officeZipcode == 0 ?
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
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange,
  },
  upperContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: "20%",
    width: '90%',
    marginTop: '10%'
  },
  logo: {
    height: '50%',
    width: '100%',
  },
  bodyContainer: {
    width: '90%',
    height: '50%',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
  },
  marginTop: {
    marginTop: '6%'
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
    marginBottom: '5%',
    fontWeight: 'bold'
  }, 
  fullWidthInput: {
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    paddingLeft: '5%'
  },
  regionInput: {
    width: '62%',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
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
    width: '100%',
    height: 48,
    borderRadius: 25,
    borderWidth: 0,    
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectStyle2: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,    
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '10%'
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
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '90%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    paddingLeft: '5%'
  },
  disabledSelectStyle: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '100%',
    height: 48,
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bottomBtnContainer: {
    width: '90%',
    height: '15%',
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