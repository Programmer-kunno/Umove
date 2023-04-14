import React, { Component }  from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  View, Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { FetchApi } from '../../../api/fetch';
import { UMColors } from '../../../utils/ColorHelper';
import GrayNavbar from '../../Components/GrayNavbar';
import { dispatch } from '../../../utils/redux';
import { clearBookingDetails } from '../../../redux/actions/Booking';
import { goBack, navigate } from '../../../utils/navigationHelper';
import { showError } from '../../../redux/actions/ErrorModal';

export default class BookingItemScreen extends Component {  
  constructor(props) {
    super(props);
    
    this.state = {
      booking: {
        bookingType: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.bookingType : this.props.route.params.bookingType,
        vehicleType: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.vehicleType : '2',
        typeOfGoods: '',
        productCategory: '',
        productSubcategory: '',
        packagingType: '',
        quantity: 0,
        width: '',
        length: '',
        weight: '',
        height: '',
        pickupName: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.pickupName : '',
        pickupStreetAddress: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.pickupStreetAddress : '',
        pickupDate: '',
        pickupTime: '',
        pickupRegion: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.pickupRegion : '',
        pickupProvince: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.pickupProvince  : '',
        pickupCity: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.pickupCity : '',
        pickupBarangay: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.pickupBarangay : '',
        pickupZipcode: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.pickupZipcode : '',
        pickupLandmark: '',
        pickupSpecialInstructions: '',
        dropoffName: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.dropoffName : '',
        dropoffStreetAddress: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.dropoffStreetAddress : '',
        dropoffRegion: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.dropoffRegion : '',
        dropoffProvince: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.dropoffProvince : '',
        dropoffCity: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.dropoffCity : '',
        dropoffBarangay: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.dropoffBarangay : '',
        dropoffZipcode: this.props.route.params?.isRebook ? this.props.route.params?.rebookData?.dropoffZipcode : '',
        dropoffLandmark: '',
        dropoffSpecialInstructions: '',
        paymentAddress: 'pickup',
        signature: 'true',
        isRebook: this.props.route.params?.isRebook ? this.props.route.params?.isRebook : false
      },
      typeValue: '',
      typeOpen: false,
      typeItems: [],
      categoryValue: '',
      categoryOpen: false,
      categoryItems: [],
      subCategoryValue: '',
      subCategoryOpen: false,
      subCategoryItems: [],
      packagingTypeValue: '',
      packagingOpen: false,
      packagingItems: [],     
    };
  }

  async componentDidMount() {
    console.log(this.props.route.params?.rebookData)
    dispatch(clearBookingDetails())
    this.loadType();
    this.loadPackaging();
  }

  async booking() {
    navigate('BookingPickUpScreen', { booking: this.state.booking })
  }

  async loadType() {
    const typeItems = await FetchApi.typesOfGoods()
    if(typeItems == undefined){
      dispatch(showError(true))
    } else {
      if(typeItems?.data?.success) {
       const items = []
        typeItems?.data?.data?.map((data) => {
          items.push({
            id: data.id,
            label: data.type_name,
            value: data.id
          })
        items.sort((a, b) => a.id - b.id)
        this.setState({ typeItems: items })
        })
      } else {
        console.log(typeItems)
      }
    }
  }

  async loadCategory(item) {
    const categoryItems = await FetchApi.productCategories(item)
    if(categoryItems == undefined){
      dispatch(showError(true))
    } else {
      if(categoryItems?.data?.success) {
        const items = []
        categoryItems?.data?.data.map((data) => {
           items.push({
             id: data.id,
             label: data.category_name,
             value: data.id
           })
         items.sort((a, b) => a.id - b.id)
         this.setState({ categoryItems: items })
         })
      } else {
        console.log(categoryItems)
      }
    }
  }

  async loadSubCategory(item) {
    const subCategoryItems = await FetchApi.productSubcategories(item)
    if(subCategoryItems == undefined){
      dispatch(showError(true))
    } else {
      if(subCategoryItems?.data?.success) {
        const items = []
        subCategoryItems?.data?.data?.map((data) => {
           items.push({
             id: data.id,
             label: data.subcategory_name,
             value: data.id
           })
         items.sort((a, b) => a.id - b.id)
         this.setState({ subCategoryItems: items })
         })
      } else {
        console.log(subCategoryItems)
      }
    }
  }

  async loadPackaging(item) {
    const packagingItems = await FetchApi.packagingTypes(item)
    if(packagingItems == undefined){
      dispatch(showError(true))
    } else {
      if(packagingItems?.data?.success) {
        const items = []
        packagingItems?.data?.data?.map((data) => {
          items.push({
            id: data.id,
            label: data.uom_name,
            value: data.id
          })
        items.sort((a, b) => a.id - b.id)
        this.setState({ packagingItems: items })
        })
      } else {
        console.log(packagingItems)
      } 
    }
  }

  plusQuantity = () => {
    let booking = this.state.booking;
    booking.quantity += 1
    this.setState({ booking });
  }

  minusQuantity = () => {
    let booking = this.state.booking;
    booking.quantity -= 1
    this.setState({ booking });
  }

  render() {
    let booking = this.state.booking;
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.mainContainer}>
          <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />


          {/* Header for Exclusive */}
          <GrayNavbar
            Title={this.state.booking.bookingType}
            onBack={() => {
              goBack()
            }}
          />

            {/* Dropdown for Type of Goods */}
          <View style={styles.goodsDropDownContainer}>
            <Text style={styles.goodsTitle}>Goods</Text>
            <DropDownPicker
              placeholder="Types of Goods"
              placeholderStyle={styles.placeholderStyle}
              style={[styles.typeDropdownStyle, {position: 'relative', zIndex: 60}]}
              containerStyle={[styles.typeDropdownContainerStyle, {position: 'relative', zIndex: 100}]}
              open={this.state.typeOpen} 
              items={this.state.typeItems}
              value={this.state.typeValue}
              setOpen={() => {this.setState({typeOpen: !this.state.typeOpen})}}
              setValue={(callback) => {this.setState(state => ({
                typeValue: callback(state.typeValue)}), () => {
                  booking.typeOfGoods = this.state.typeValue;
                  this.loadCategory(`type=${this.state.typeValue}`)
                  this.setState({ booking })
                })
              }}
              setItems={(callback) => {this.setState(state => ({
                typeItems: callback(state.typeItems)}))}}
            />
            <DropDownPicker
              placeholder="Category"
              placeholderStyle={styles.placeholderStyle}
              style={!this.state.typeValue == '' ? [styles.typeDropdownStyle, {position: 'relative', zIndex: 59}] : [styles.typeDropdownStyleDisabled, {position: 'relative', zIndex: 59}]}
              containerStyle={[styles.typeDropdownContainerStyle, { zIndex: 59 }]}
              open={this.state.categoryOpen} 
              items={this.state.categoryItems}
              value={this.state.categoryValue}
              disabled={!this.state.typeValue == '' ? false : true}
              setOpen={() => {this.setState({categoryOpen: !this.state.categoryOpen})}}
              setValue={(callback) => {this.setState(state => ({
                categoryValue: callback(state.categoryValue)}), () => {
                  booking.productCategory = this.state.categoryValue;
                  this.loadSubCategory(`category=${this.state.typeValue}`)
                  this.setState({ booking })
                })
              }}
              setItems={(callback) => {this.setState(state => ({
                typeItems: callback(state.typeItems)}))}}
            />
             
             <DropDownPicker
              placeholder="Subcategory"
              placeholderStyle={styles.placeholderStyle}
              style={!this.state.categoryValue == '' ? [styles.typeDropdownStyle, {position: 'relative', zIndex: 0}] : [styles.typeDropdownStyleDisabled, {position: 'relative', zIndex: 58}]}
              containerStyle={[styles.typeDropdownContainerStyle, { zIndex: 58 }]}
              open={this.state.subCategoryOpen} 
              items={this.state.subCategoryItems}
              value={this.state.subCategoryValue}
              disabled={!this.state.categoryValue == '' ? false : true}
              setOpen={() => {this.setState({subCategoryOpen: !this.state.subCategoryOpen})}}
              setValue={(callback) => {this.setState(state => ({
                subCategoryValue: callback(state.subCategoryValue)}), () => {
                booking.productSubcategory = this.state.subCategoryValue;
                  this.setState({ booking })
                })
              }}
              setItems={(callback) => {this.setState(state => ({
                typeItems: callback(state.typeItems)}))}}
            />
          </View> 

          <View style={styles.packageDetailsContainer}>
            <View style={styles.quantityContainer}>
              <Text style={[styles.itemsNameTxt, {marginLeft: 0}]}>Quantity</Text>
                { booking.quantity == 0 ?
                <TouchableOpacity style={styles.quantityButtonGray} disabled={true}>
                  <Text style={styles.quantityButtonText}> - </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.quantityButtonOrange} onPress={this.minusQuantity}>
                  <Text style={styles.quantityButtonText}> - </Text>
                </TouchableOpacity>
                }
                <Text style={styles.quantityText}>{booking.quantity} </Text>
                <TouchableOpacity style={styles.quantityButtonOrange} onPress={this.plusQuantity}>
                  <Text style={styles.quantityButtonText}> + </Text>
                </TouchableOpacity> 
            </View>
            <View style={styles.packageHalfContainer}>
              <View style={styles.packageItemsContainer}>
                  <Text style={styles.itemsNameTxt}>Width</Text>
                  <View style={styles.goodsTxtInputContainer}>
                    <TextInput
                        style={styles.txtInputValue}
                        placeholder={'00.00'}
                        keyboardType='decimal-pad'
                        returnKeyType='done'
                        onChangeText={(data) => {
                          booking.width = data;
                          this.setState({ booking })
                          
                        }}
                    />
                    <TextInput
                      style={styles.txtInputUnit}
                      placeholder={'cm'}
                      editable={false}
                    />
                    {
                      this.state.booking.width > 100 ?
                        <Text style={styles.errorTxt}>Max value is 100</Text>
                      : this.state.booking.width < 0 &&
                        <Text style={styles.errorTxt}>Value must be above 0</Text>
                    }
                  </View>                    
              </View>
              <View style={styles.packageItemsContainer}>
                  <Text style={styles.itemsNameTxt}>Length</Text>
                  <View style={styles.goodsTxtInputContainer}>
                    <TextInput
                      style={styles.txtInputValue}
                      placeholder={'00.00'}
                      keyboardType='decimal-pad'
                      returnKeyType='done'
                      onChangeText={(data) => {
                        booking.length = data;
                        this.setState({ booking })
                        
                      }}
                    />
                    <TextInput
                      style={styles.txtInputUnit}
                      placeholder={'cm'}
                      editable={false}
                    />
                    {
                      this.state.booking.length > 100 ?
                        <Text style={styles.errorTxt}>Max value is 100</Text>
                      : this.state.booking.length < 0 &&
                        <Text style={styles.errorTxt}>Value must be above 0</Text>
                    }
                  </View>
              </View>
            </View>
            <View style={styles.packageHalfContainer}>
              <View style={styles.packageItemsContainer}>
                <Text style={styles.itemsNameTxt}>Weight</Text>   
                <View style={styles.goodsTxtInputContainer}>
                  <TextInput
                    style={styles.txtInputValue}
                    placeholder={'00.00'}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                    onChangeText={(data) => {
                      booking.weight = data;
                      this.setState({ booking })
                      
                    }}
                   />
                  <TextInput
                    style={styles.txtInputUnit}
                    placeholder={'kg'}
                    editable={false}
                  />
                    {
                      this.state.booking.weight > 1000 ?
                        <Text style={styles.errorTxt}>Max value is 1000</Text>
                      : this.state.booking.weight < 0 &&
                        <Text style={styles.errorTxt}>Value must be above 0</Text>
                    }
                </View>
              </View>
              <View style={styles.packageItemsContainer}>
                <Text style={styles.itemsNameTxt}>Heigth</Text>
                <View style={styles.goodsTxtInputContainer}>
                  <TextInput
                    style={styles.txtInputValue}
                    placeholder={'00.00'}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                    onChangeText={(data) => {
                      booking.height = data;
                      this.setState({ booking })
                      
                    }}
                  />
                  <TextInput
                    style={styles.txtInputUnit}
                    placeholder={'cm'}
                    editable={false}
                  />
                    {
                      this.state.booking.height > 100 ?
                        <Text style={styles.errorTxt}>Max value is 100</Text>
                      : this.state.booking.height < 0 &&
                        <Text style={styles.errorTxt}>Value must be above 0</Text>
                    }
                </View>
              </View>
            </View>
          </View>

          <View style={styles.packagingDropDownContainer}>
            <Text style={styles.goodsTitle}>Packaging Type</Text>
            <DropDownPicker
              placeholder="Packaging Type"
              placeholderStyle={styles.placeholderStyle}
              style={styles.typeDropdownStyle}
              containerStyle={styles.typeDropdownContainerStyle}
              open={this.state.packagingOpen} 
              items={this.state.packagingItems}
              value={this.state.packagingTypeValue}
              setOpen={() => {this.setState({packagingOpen: !this.state.packagingOpen})}}
              setValue={(callback) => {this.setState(state => ({
                packagingTypeValue: callback(state.packagingTypeValue)}), () => {
                  booking.packagingType = this.state.packagingTypeValue;
                  this.setState({ booking })
                })
              }}
              setItems={(callback) => {this.setState(state => ({
                packagingItems: callback(state.packagingItems)}))}}
            />
          </View>
          
          <View style={styles.btnContainer}>
          {/* Add Additional Items Button */}
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            {/* { booking.typeValue == '' || booking.quantity == 0 || booking.width == '' || booking.length == '' || booking.weight == '' || booking.packagingValue == '' ?
            <TouchableOpacity style={styles.addButtonGray} disabled={true}>
              <Text style={styles.buttonText}> Add Additional Item </Text>
            </TouchableOpacity>
            :
            // Leave Disabled for Now
            // <TouchableOpacity style={styles.addButtonOrange} onPress={() => alert('Add Item')}>
            //   <Text style={styles.buttonText}> Add Additional Item </Text>
            // </TouchableOpacity>
            <TouchableOpacity style={styles.addButtonGray} disabled={true}>
              <Text style={styles.buttonText}> Add Additional Items </Text>
            </TouchableOpacity>
            } */}

          {/* Next Button */}
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            { booking.typeOfGoods == '' || 
              booking.productSubcategory == '' || 
              booking.quantity == 0 || 
              booking.width == '' || 
              booking.length == '' || 
              booking.weight == '' || 
              booking.height == '' || 
              booking.width > 100 || booking.width < 0 || 
              booking.length > 100 || booking.length < 0 || 
              booking.weight > 1000 || booking.weight < 0 || 
              booking.height > 100 || booking.height < 0 || 
              booking.packagingType == '' ?
            <TouchableOpacity style={styles.nextButtonGray} disabled={true}>
              <Text style={styles.buttonText}> NEXT </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.nextButtonOrange} onPress={() => {
              this.booking();
            }}>
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
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center',
  },
  btnContainer: {
    width: '95%',
    height: '25%',
    marginTop: '2%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dropDownContainer: {
    alignItems: 'center',
  },
  marginBottom: {
    marginBottom: '65%'
  },
  typeDropdownStyle: {
    paddingLeft: 20,
    borderRadius: 10,
  },
  typeDropdownStyleDisabled: {
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: UMColors.ligthGray,
  },
  typeDropdownContainerStyle: {
    width: '90%',
    marginTop: '3%',
  },
  quantityText: {
    fontSize: 15,
    color: UMColors.black,
    fontWeight: 'bold',
    paddingRight: 10,
    paddingLeft: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    lineHeight: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  addButtonGray: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 7,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
  },
  addButtonOrange: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 7,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
  },
  nextButtonGray: {
    marginTop: '5%',
    height: 50,
    width: '90%',
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
    marginTop: '5%',
    height: 50,
    width: '90%',
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
  goodsDropDownContainer: {
    width: '95%',
    marginTop: '3%',
    height: '28%',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: UMColors.BGOrange,
    borderWidth: 1,
    borderColor: UMColors.ligthGray,
    elevation: 10,
    zIndex: 50
  },
  packagingDropDownContainer: {
    width: '95%',
    marginTop: '3%',
    height: '13%',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: UMColors.BGOrange,
    borderWidth: 1,
    borderColor: UMColors.ligthGray,
    elevation: 10,
    zIndex: 100
  },
  goodsTitle: {
    marginTop: '2%',
    color: UMColors.primaryOrange,
    fontSize: 16,
    fontWeight: 'bold'
  },
  packageDetailsContainer: {
    width: '95%',
    height: '22%',
    marginTop: '3%',
    borderRadius: 15,
    backgroundColor: UMColors.BGOrange,
    borderWidth: 1,
    borderColor: UMColors.ligthGray,
    elevation: 10,
  },
  packageHalfContainer: {
    height: '30%',
    width: '100%',
    flexDirection: 'row',
  },
  quantityContainer: {
    height: '28%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  packageItemsContainer: {
    height: '100%',
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemsNameTxt: {
    fontSize: 15,
    marginRight: 10,
    marginLeft: '7%'
  },
  errorTxt: {
    color: UMColors.red, 
    position: 'absolute', 
    bottom: -8, 
    fontSize: 12, 
    fontWeight: 'bold'
  }, 
  quantityButtonOrange: {
    backgroundColor: UMColors.primaryOrange,
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  quantityButtonGray: {
    backgroundColor: UMColors.primaryGray,
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  goodsTxtInputContainer: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '7%'
  },
  txtInputValue: {
    backgroundColor: UMColors.white,
    borderTopColor: UMColors.primaryOrange,
    borderLeftColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderWidth: 1.5,
    borderRightWidth: 1,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    textAlign: 'center',
    width: '65%',
    height: '65%',
    elevation: 7,
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 0
  },
  txtInputUnit: {
    height: '65%',
    width: '35%',
    textAlign: 'center',
    backgroundColor: UMColors.white,
    borderWidth: 1.5,
    borderLeftWidth: 1,
    borderTopColor: UMColors.primaryOrange,
    borderRightColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderLeftColor: 'white',
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    elevation: 7,
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 0
  }
})