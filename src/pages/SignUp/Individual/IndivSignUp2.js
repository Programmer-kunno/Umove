import React, { Component }  from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { FetchApi }  from '../../../api/fetch'
import { getStorage, setStorage } from '../../../api/helper/storage';

export default class IndivSignUp2 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      register: {},
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
    let register = await getStorage('register')
    this.setState({register})
  }

  async signUp() {
      let register = this.state.register;
      await setStorage('register', register);
      this.props.navigation.navigate('IndivSignUp3')
    }

  async loadRegion() {
    let [regionList, err] = await FetchApi.regions()
    if(regionList) {
      this.setState({regionList})
    } 
    if(err) {
      console.log(err)
    }
  }

  async loadProvince(regionCode) {
    let [provinceList, err] = await FetchApi.provinces(regionCode)
    if(provinceList) {
      this.setState({provinceList})
    } 
    if(err) {
      console.log(err)
    }
  }

  async loadCity(provinceCode) {
    let [cityList, err] = await FetchApi.cities(provinceCode)
    if(cityList) {
      this.setState({cityList})
    } 
    if(err) {
      console.log(err)
    }
  }

  async loadBarangay(cityCode) {
    let [barangayList, err] = await FetchApi.barangays(cityCode)
    if(barangayList) {
      this.setState({barangayList})
    }
    if(err) {
      console.log(err)
    }
  }

  render() {
    let register = this.state.register;
    return(
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.content}>
      <KeyboardAwareScrollView>

                <ScrollView>
                  {/* Logo */}
                  <View style={styles.alignItemCenter}>
                    <Image
                      source={require('../../../assets/logo/logo-primary.png')}
                      style={styles.logo}
                    />
                  </View>

                  <View style={[styles.inputContainer,]}>
                    {/* Header */}
                    <Text style={styles.text}>
                      Residential Address
                    </Text>

                    {/* Street Address */}
                    <TextInput
                      style={[styles.fullWidthInput]}
                      onChangeText={(val) => {
                        register.streetAddress = val;
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
                        register.region = region.name;
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
                          register.zipcode = val;
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
                  <View style={[styles.inputContainer, styles.marginTop, styles.row]}>
                    { register.region !== '' ? 
                      <ModalSelector
                        data={this.state.provinceList}
                        keyExtractor= {province => province.code}
                        labelExtractor= {province => province.name}
                        initValue="Select Province"
                        onChange={(province) => {
                          register.province = province.name;
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
                          register.city = city.name;
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
                          register.barangay = barangay.name;
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

                  <View style={styles.alignItemCenter}>
                  {/* Next Button */}
                    {/* Make button gray when not all inputs are filled out, orange when filled out */}
                    { register.streetAddress == '' || register.region == '' || register.province == '' || register.city == '' || register.barangay == '' || register.zipcode == 0 ?
                    <TouchableOpacity style={styles.nextButtonGray} disabled={true}>
                      <Text style={styles.buttonText}> NEXT </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.nextButtonOrange} onPress={() => this.signUp() }>
                      <Text style={styles.buttonText}> NEXT </Text>
                    </TouchableOpacity>
                    }
                  </View>
                  
                  </ScrollView>
                  </KeyboardAwareScrollView>

            </View>
          </View>
        </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: 'rgb(238, 241, 217)',
  },
  innerContainer: {
    flex: 1,
    marginTop: '10%'
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  alignItemCenter: {
    alignItems: 'center'
  },
  logo: {
    height: 70,
    width: 250,
    marginTop: '25%',
    marginBottom: '15%',
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
    marginTop: '10%',
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
  nextButtonGray: {
    marginTop: '15%',
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  nextButtonOrange: {
    marginTop: '15%',
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
})