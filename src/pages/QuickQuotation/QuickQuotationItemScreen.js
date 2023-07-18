import React, { Component, useEffect, useState }  from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  View, Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard,
  Dimensions
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { FetchApi } from '../../api/fetch';
import { UMColors } from '../../utils/ColorHelper';
import CustomNavbar from '../Components/CustomNavbar';
import { dispatch } from '../../utils/redux';
import { goBack, navigate } from '../../utils/navigationHelper';
import { showError } from '../../redux/actions/ErrorModal';
import { useSelector } from 'react-redux';

const deviceWidth = Dimensions.get('screen').width

export default QuickQuotationItemScreen = (props) => {  
  const [bookingData, setBookingData] = useState({
    vehicleType: '',
    vehicleName: '',
    typeOfGoods: '',
    productCategory: '',
    productSubcategory: '',
    packagingType: '',
    quantity: 0,
    width: '',
    length: '',
    weight: '',
    height: '',
    pickupName: '',
    pickupStreetAddress: '',
    pickupRegion: '',
    pickupProvince: '',
    pickupCity: '',
    pickupBarangay: '',
    pickupZipcode: '',
    pickupLandmark: '',
    pickupLatitude: '',
    pickupLongitude: '',
    dropoffName: '',
    dropoffStreetAddress: '',
    dropoffRegion: '',
    dropoffProvince: '',
    dropoffCity: '',
    dropoffBarangay: '',
    dropoffZipcode: '',
    dropoffLandmark: '',
    dropoffLatitude: '',
    dropoffLongitude: '',
  })
  const [typeValue, setTypeValue] = useState('')
  const [typeOpen, setTypeOpen] = useState(false)
  const [typeItems, setTypeItems] = useState([])
  const [categoryValue, setCategoryValue] = useState('')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [categoryItems, setCategoryItems] = useState([])
  const [subCategoryValue, setSubCategoryValue] = useState('')
  const [subCategoryOpen, setSubCategoryOpen] = useState(false)
  const [subCategoryItems, setSubCategoryItems] = useState([])
  const [packagingValue, setPackagingValue] = useState('')
  const [packagingOpen, setPackagingOpen] = useState(false)
  const [packagingItems, setPackagingItems] = useState([])

  useEffect(() => {
    setBookingData({
      ...bookingData,
      vehicleType: props.route.params?.vehicleType,
      vehicleName: props.route.params?.vehicleName,
    })
    loadType();
    loadPackaging();
  }, [])

  const booking = () => {
    navigate('QuickQuotationPickUp', { booking: bookingData })
  }

  const loadType = async() => {
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
        setTypeItems(items)
        })
      } else {
        console.log(typeItems)
      }
    }
  }

  const loadCategory = async(item) => {
    const categoryItems = await FetchApi.productCategories(item)
    console.log(categoryItems)
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
         setCategoryItems(items)
         })
      } else {
        console.log(categoryItems)
      }
    }
  }

  const loadSubCategory = async(item) => {
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
         setSubCategoryItems(items)
         })
      } else {
        console.log(subCategoryItems)
      }
    }
  }

  const loadPackaging = async(item) => {
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
        setPackagingItems(items)
        })
      } else {
        console.log(packagingItems)
      } 
    }
  }

  const plusQuantity = () => {
    let newQuantity = bookingData.quantity += 1
    setBookingData({ ...bookingData, quantity: newQuantity })
  }

  const minusQuantity = () => {
    let newQuantity = bookingData.quantity -= 1
    setBookingData({ ...bookingData, quantity: newQuantity })
  }

  const checkInputs = () => {
    if( bookingData.typeOfGoods == '' || bookingData.productSubcategory == '' || bookingData.quantity == 0 || 
        bookingData.width == '' || bookingData.length == '' || bookingData.weight == '' || bookingData.height == '' || 
        bookingData.width > 100 || bookingData.width <= 0 || bookingData.length > 100 || bookingData.length <= 0 || 
        bookingData.weight > 1000 || bookingData.weight <= 0 || bookingData.height > 100 || bookingData.height <= 0 || 
        bookingData.packagingType == '' || !(bookingData.width % 1 >= 0) || !(bookingData.length % 1 >= 0) ||
        !(bookingData.weight % 1 >= 0) || !(bookingData.height % 1 >= 0)  
      ){
        return true
       } else {
        return false
       }
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />


        {/* Header for Exclusive */}
        <CustomNavbar
          Title={'Quick Quotation'}
          onBack={() => {
            goBack()
          }}
        />

          {/* Dropdown for Type of Goods */}
        <View style={styles.goodsDropDownContainer}>
          <DropDownPicker
            placeholder="Select Type of Good"
            placeholderStyle={styles.placeholderStyle}
            style={[styles.typeDropdownStyle, {position: 'relative', zIndex: 60}]}
            containerStyle={[styles.typeDropdownContainerStyle, {position: 'relative', zIndex: 100}]}
            arrowIconStyle={{ tintColor: UMColors.primaryOrange }}
            dropDownContainerStyle={{ borderWidth: 0 }}
            open={typeOpen} 
            items={typeItems}
            value={typeValue}
            setOpen={() => {setTypeOpen(!typeOpen)}}
            setValue={setTypeValue}
            setItems={setTypeItems}
            onChangeValue={() => {
              loadCategory(`type=${typeValue}`)
              setBookingData({ ...bookingData, typeOfGoods: typeValue })
            }}
          />
          <DropDownPicker
            placeholder="Select Category"
            placeholderStyle={styles.placeholderStyle}
            style={!typeValue == '' ? [styles.typeDropdownStyle, {position: 'relative', zIndex: 59}] : [styles.typeDropdownStyleDisabled, {position: 'relative', zIndex: 59}]}
            containerStyle={[styles.typeDropdownContainerStyle, { zIndex: 59 }]}
            arrowIconStyle={{ tintColor: UMColors.primaryOrange }}
            dropDownContainerStyle={{ borderWidth: 0 }}
            open={categoryOpen} 
            items={categoryItems}
            value={categoryValue}
            disabled={!typeValue == '' ? false : true}
            setOpen={() => {setCategoryOpen(!categoryOpen)}}
            setValue={setCategoryValue}
            setItems={setCategoryItems}
            onChangeValue={() => {
              loadSubCategory(`category=${categoryValue}`)
              setBookingData({ ...bookingData, productCategory: categoryValue })
            }}
          />    
          <DropDownPicker
            placeholder="Select Sub-category"
            placeholderStyle={styles.placeholderStyle}
            style={!categoryValue == '' ? [styles.typeDropdownStyle, {position: 'relative', zIndex: 0}] : [styles.typeDropdownStyleDisabled, {position: 'relative', zIndex: 58}]}
            containerStyle={[styles.typeDropdownContainerStyle, { zIndex: 58 }]}
            arrowIconStyle={{ tintColor: UMColors.primaryOrange }}
            dropDownContainerStyle={{ borderWidth: 0 }}
            open={subCategoryOpen} 
            items={subCategoryItems}
            value={subCategoryValue}
            disabled={!categoryValue == '' ? false : true}
            setOpen={() => {setSubCategoryOpen(!subCategoryOpen)}}
            setValue={setSubCategoryValue}
            setItems={setSubCategoryItems}
              onChangeValue={() => setBookingData({ ...bookingData, productSubcategory: subCategoryValue })}
          />
          <DropDownPicker
            placeholder="Select Packaging Type"
            placeholderStyle={styles.placeholderStyle}
            style={styles.typeDropdownStyle}
            containerStyle={styles.typeDropdownContainerStyle}
            arrowIconStyle={{ tintColor: UMColors.primaryOrange }}
            dropDownContainerStyle={{ borderWidth: 0 }}
            open={packagingOpen} 
            items={packagingItems}
            value={packagingValue}
            setOpen={() => {setPackagingOpen(!packagingOpen)}}
            setValue={setPackagingValue}
            setItems={setPackagingItems}
              onChangeValue={() => setBookingData({ ...bookingData, packagingType: packagingValue })}
          />
        </View> 

        <View style={styles.packageDetailsContainer}>
          <View style={styles.quantityContainer}>
            <Text style={[styles.itemsNameTxt, {marginLeft: 0}]}>Quantity</Text>
            <TouchableOpacity 
              style={bookingData.quantity == 0 ? styles.quantityButtonGray : styles.quantityButtonOrange} 
              disabled={bookingData.quantity == 0}
              onPress={minusQuantity}
            >
              <Text style={styles.quantityButtonText}> - </Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{bookingData.quantity} </Text>
            <TouchableOpacity style={styles.quantityButtonOrange} onPress={plusQuantity}>
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
                      setBookingData({ ...bookingData, width: data })
                    }}
                />
                <Text style={styles.unitTxt}>| cm</Text>
                <Text style={styles.errorTxt}>
                  {
                    bookingData.width &&
                      (
                        bookingData.width > 100 ? 'Max value is 100'
                      :
                        bookingData.width <= 0 ? 'Value must be above 0' : !(bookingData.width % 1 >= 0) && 'Invalid Input'
                      )
                  }
                </Text>
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
                  onChangeText={(data) => setBookingData({ ...bookingData, length: data })}
                />
                <Text style={styles.unitTxt}>| cm</Text>
                <Text style={styles.errorTxt}>
                  {
                    bookingData.length &&
                      (
                        bookingData.length > 100 ? 'Max value is 100'
                      :
                        bookingData.length <= 0 ? 'Value must be above 0' : !(bookingData.length % 1 >= 0) && 'Invalid Input'
                      )
                  }
                </Text>
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
                  onChangeText={(data) => setBookingData({ ...bookingData, weight: data })}
                />
                <Text style={styles.unitTxt}>| kg</Text>
                <Text style={styles.errorTxt}>
                  {
                    bookingData.weight &&
                      (
                        bookingData.weight > 1000 ? 'Max value is 1000'
                      :
                        bookingData.weight <= 0 ? 'Value must be above 0' : !(bookingData.weight % 1 >= 0) && 'Invalid Input'
                      )
                  }
                </Text>
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
                  onChangeText={(data) => setBookingData({ ...bookingData, height: data })}
                />
                <Text style={styles.unitTxt}>| cm</Text>
                <Text style={styles.errorTxt}>
                  {
                    bookingData.height &&
                      (
                        bookingData.height > 100 ? 'Max value is 100'
                      :
                        bookingData.height <= 0 ? 'Value must be above 0' : !(bookingData.height % 1 >= 0) && 'Invalid Input'
                      )
                  }
                </Text>
              </View>
            </View>

          </View>
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
          <TouchableOpacity 
            style={checkInputs() ? styles.nextButtonGray : styles.nextButtonOrange} 
            disabled={checkInputs()}
            onPress={() => booking()}
          >            
            <Text style={styles.buttonText}> NEXT </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
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
    borderWidth: 0,
    borderRadius: 5,
    elevation: 5
  },
  typeDropdownStyleDisabled: {
    paddingLeft: 20,
    borderRadius: 10,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: UMColors.ligthGray,
    elevation: 5
  },
  typeDropdownContainerStyle: {
    width: '90%',
    marginTop: '3%',
  },
  quantityText: {
    fontSize: 15,
    textAlign: 'center',
    width: 30,
    color: UMColors.black,
    fontWeight: 'bold',
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
    position: 'absolute',
    bottom: 10,
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
    position: 'absolute',
    bottom: 10,
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
    alignItems: 'center',
    zIndex: 50
  },
  placeholderStyle: {
    color: UMColors.primaryGray
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
  },
  packageHalfContainer: {
    height: '32%',
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
    bottom: -17, 
    fontSize: 12, 
    fontWeight: 'bold'
  }, 
  quantityButtonOrange: {
    backgroundColor: UMColors.primaryOrange,
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    marginHorizontal: '2%',
  },
  quantityButtonGray: {
    backgroundColor: UMColors.primaryGray,
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    marginHorizontal: '2%',
  },
  goodsTxtInputContainer: {
    width: '50%',
    height: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '7%',
    backgroundColor: UMColors.white,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    borderRadius: 5,
    elevation: 7,
  },
  unitTxt: {
    fontSize: 15,
    color: UMColors.primaryGray,
  },
  txtInputValue: {
    textAlign: 'center',
    width: '50%',
    height: '100%',
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 0
  },
  specialInputContainer: {
    width: deviceWidth,
    alignItems: 'center',
    height: '15%',
  },
  specialTxtInput: {
    width: '95%',
    height: '100%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    borderRadius: 7,
    textAlignVertical: 'top',
    backgroundColor: UMColors.white,
    paddingHorizontal: 15
  }
})