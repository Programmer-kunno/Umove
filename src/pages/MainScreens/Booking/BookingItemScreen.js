import React, { Component, useEffect, useRef, useState }  from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  View, Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard,
  Dimensions,
  ScrollView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { FetchApi } from '../../../api/fetch';
import { UMColors } from '../../../utils/ColorHelper';
import CustomNavbar from '../../Components/CustomNavbar';
import { dispatch } from '../../../utils/redux';
import { clearBookingDetails } from '../../../redux/actions/Booking';
import { goBack, navigate } from '../../../utils/navigationHelper';
import { showError } from '../../../redux/actions/ErrorModal';
import { useSelector } from 'react-redux';
import ErrorOkModal from '../../Components/ErrorOkModal';
import { TextSize, normalize } from '../../../utils/stringHelper';

const deviceWidth = Dimensions.get('screen').width

export default BookingItemScreen = (props) => {  
  const userDetailsData = useSelector(state => state.userOperations.userDetailsData)
  const [bookingData, setBookingData] = useState({
    bookingType: '',
    chargeType: '',
    vehicleType: '',
    isSignatureRequired: true,
    pickupName: '',
    pickupStreetAddress: '',
    pickupDate: '',
    pickupTime: '',
    pickupRegion: '',
    pickupProvince: '',
    pickupCity: '',
    pickupBarangay: '',
    pickupZipcode: '',
    pickupLandmark: '',
    pickupSpecialInstructions: '',
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
    dropoffSpecialInstructions: '',
    dropoffLatitude: '',
    dropoffLongitude: '',
    paymentAddress: 'pickup',
    signature: 'true',
    isRebook: false,
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
  const [error, setError] = useState({ value: false, message: '' })
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const scrollViewRef = useRef(null)
  const [arrayOfItems, setArrayOfItem] = useState([
    {
      typeOfGoods: '',
      productCategory: '',
      productSubCategory: '',
      packagingType: '',
      quantity: 0,
      width: '',
      length: '',
      weight: '',
      height: '',
    },
  ])

  useEffect(() => {
    const propsRebookData = props.route.params?.rebookData
    if(propsRebookData){
      isRebook(propsRebookData)
    } else {
      setBookingData({
        ...bookingData,
        bookingType: props.route.params?.bookingType,
        vehicleType: props.route.params?.vehicleType,
        chargeType: userDetailsData.charge_type,
      })
    }
    updateItem()
    dispatch(clearBookingDetails())
    loadType();
    loadPackaging();
  }, [])

  useEffect(() => {
    updateItem()
  }, [selectedItemIndex])

  const updateItem = () => {
    setTypeValue(arrayOfItems[selectedItemIndex].typeOfGoods)
    setCategoryValue(arrayOfItems[selectedItemIndex].productCategory)
    setSubCategoryValue(arrayOfItems[selectedItemIndex].productSubCategory)
    setPackagingValue(arrayOfItems[selectedItemIndex].packagingType)
  }

  const isRebook = (propsRebookData) => {
    setBookingData({
      ...bookingData,
      bookingType: propsRebookData.bookingType,
      vehicleType: propsRebookData.vehicleType,
      pickupName: propsRebookData.pickupName,
      pickupStreetAddress: propsRebookData.pickupStreetAddress,
      pickupRegion: propsRebookData.pickupRegion,
      pickupProvince: propsRebookData.pickupProvince ,
      pickupCity: propsRebookData.pickupCity,
      pickupBarangay: propsRebookData.pickupBarangay,
      pickupZipcode: propsRebookData.pickupZipcode,
      dropoffName: propsRebookData.dropoffName,
      dropoffStreetAddress: propsRebookData.dropoffStreetAddress,
      dropoffRegion: propsRebookData.dropoffRegion,
      dropoffProvince: propsRebookData.dropoffProvince,
      dropoffCity: propsRebookData.dropoffCity,
      dropoffBarangay: propsRebookData.dropoffBarangay,
      dropoffZipcode: propsRebookData.dropoffZipcode,
      isRebook: props.route.params?.isRebook
    })
  }

  const booking = () => {
    navigate('BookingPickUpScreen', { booking: {... bookingData, bookingItems: arrayOfItems},})
  }

  const loadType = async() => {
    const typeItems = await FetchApi.typesOfGoods()
    if(typeItems == undefined){
      dispatch(showError(true))
    } else {
      if(typeItems?.data?.success) {
       const items = []
       if(typeItems?.data?.data.length !== 0){
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
        setTypeItems(items)
       }
      } else {
        console.log(typeItems)
      }
    }
  }

  const loadCategory = async(item) => {
    const categoryItems = await FetchApi.productCategories(item)
    if(categoryItems == undefined){
      dispatch(showError(true))
    } else {
      if(categoryItems?.data?.success) {
        const items = []
        if(categoryItems?.data?.data.length !== 0){
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
          setCategoryItems(items)
        }
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
        if(subCategoryItems?.data?.data.length !== 0){
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
          setSubCategoryItems(items)
        }
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
        if(subCategoryItems?.data?.data.length !== 0){
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
          setPackagingItems(items)
        }
      } else {
        console.log(packagingItems)
      } 
    }
  }

  const plusQuantity = () => {
    let newQuantity = arrayOfItems[selectedItemIndex].quantity += 1
    const newValue = arrayOfItems.map((item, index) => {
      if(index === selectedItemIndex){
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setArrayOfItem(newValue)
  }

  const minusQuantity = () => {
    let newQuantity = arrayOfItems[selectedItemIndex].quantity -= 1
    const newValue = arrayOfItems.map((item, index) => {
      if(index === selectedItemIndex){
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setArrayOfItem(newValue)
  }

  const checkInputs = () => {
    let result = true
    for(let i = 0; i < arrayOfItems.length; i++){
      if(arrayOfItems[i].typeOfGoods == '' || arrayOfItems[i].productSubCategory == '' || arrayOfItems[i].quantity == 0 || 
        arrayOfItems[i].width == '' || arrayOfItems[i].length == '' || arrayOfItems[i].weight == '' || arrayOfItems[i].height == '' || 
        arrayOfItems[i].width > 100 || arrayOfItems[i].width <= 0 || arrayOfItems[i].length > 100 || arrayOfItems[i].length <= 0 || 
        arrayOfItems[i].weight > 1000 || arrayOfItems[i].weight <= 0 || arrayOfItems[i].height > 100 || arrayOfItems[i].height <= 0 || 
        arrayOfItems[i].packagingType == '' || !(arrayOfItems[i].width % 1 >= 0) || !(arrayOfItems[i].length % 1 >= 0) ||
        !(arrayOfItems[i].weight % 1 >= 0) || !(arrayOfItems[i].height % 1 >= 0)  
      ){
        result = true
        break;
      } else {
        result = false
      }
    }
    return result
  }

  const scrollRef = () => {
    scrollViewRef.current.scrollToEnd({ animated: true, })
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />

        <ErrorOkModal
          Visible={error.value}
          ErrMsg={error.message}
          OkButton={() => setError({ value: false, message: '' })}
        />

        {/* Header for Exclusive */}
        <CustomNavbar
          Title={bookingData.bookingType + ' Booking'}
          onBack={() => {
            goBack()
          }}
        />

        <View style={styles.bodyContainer}>
          {/* Dropdown for Type of Goods */}
          <ScrollView 
            style={styles.itemDrawerContainer}
            contentContainerStyle={{ alignItems: 'center' }}
            horizontal={true}
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollRef()
            }}
          >
            {
              arrayOfItems.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.itemDrawerBtn, index === selectedItemIndex && { backgroundColor: UMColors.primaryOrange }]}
                  onPress={() => {
                    setSelectedItemIndex(index)
                  }}
                >
                  <Text style={styles.itemTxt}>{'Item ' + (index + 1)}</Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
          <View style={styles.goodsDropDownContainer}>
            <DropDownPicker
              placeholder="Select Type of Goods"
              placeholderStyle={styles.placeholderStyle}
              labelStyle={{ fontSize: normalize(TextSize('Normal')) }}
              listItemLabelStyle={{ fontSize: normalize(TextSize('Normal')) }}
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
                arrayOfItems[selectedItemIndex].typeOfGoods = typeValue
                setArrayOfItem(arrayOfItems)
              }}
            />
            <DropDownPicker
              placeholder="Select Category"
              placeholderStyle={styles.placeholderStyle}
              labelStyle={{ fontSize: normalize(TextSize('Normal')) }}
              listItemLabelStyle={{ fontSize: normalize(TextSize('Normal')) }}
              style={!typeValue == '' ? [styles.typeDropdownStyle, {position: 'relative', zIndex: 59}] : [styles.typeDropdownStyleDisabled, {position: 'relative', zIndex: 59}]}
              containerStyle={[styles.typeDropdownContainerStyle, { zIndex: 59 }]}
              arrowIconStyle={{ tintColor: UMColors.primaryOrange }}
              dropDownContainerStyle={{ borderWidth: 0, }}
              open={categoryOpen} 
              items={categoryItems}
              value={categoryValue}
              disabled={!typeValue == '' ? false : true}
              setOpen={() => {setCategoryOpen(!categoryOpen)}}
              setValue={setCategoryValue}
              setItems={setCategoryItems}
              onChangeValue={() => {
                loadSubCategory(`category=${categoryValue}`)
                arrayOfItems[selectedItemIndex].productCategory = categoryValue
                setArrayOfItem(arrayOfItems)
              }}
            />    
            <DropDownPicker
              placeholder="Select Sub-category"
              placeholderStyle={styles.placeholderStyle}
              labelStyle={{ fontSize: normalize(TextSize('Normal')) }}
              listItemLabelStyle={{ fontSize: normalize(TextSize('Normal')) }}
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
              onChangeValue={() => {
                arrayOfItems[selectedItemIndex].productSubCategory = subCategoryValue
                setArrayOfItem(arrayOfItems)
              }}
            />
            <DropDownPicker
              placeholder="Select Packaging Type"
              labelStyle={{ fontSize: normalize(TextSize('Normal')) }}
              listItemLabelStyle={{ fontSize: normalize(TextSize('Normal')) }}
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
              onChangeValue={() => {
                arrayOfItems[selectedItemIndex].packagingType = packagingValue
                setArrayOfItem(arrayOfItems)
              }}
            />
          </View> 

          <View style={styles.packageDetailsContainer}>
            <View style={styles.quantityContainer}>
              <Text style={[styles.itemsNameTxt, {marginLeft: 0}]}>Quantity</Text>
              <TouchableOpacity 
                style={arrayOfItems[selectedItemIndex].quantity == 0 ? styles.quantityButtonGray : styles.quantityButtonOrange} 
                disabled={bookingData.quantity == 0}
                onPress={minusQuantity}
              >
                <Text style={styles.quantityButtonText}> - </Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{arrayOfItems[selectedItemIndex].quantity} </Text>
              <TouchableOpacity style={styles.quantityButtonOrange} onPress={plusQuantity}>
                <Text style={styles.quantityButtonText}> + </Text>
              </TouchableOpacity> 
            </View>
            <View style={styles.packageHalfContainer}>
              <View style={styles.packageItemsContainer}>
                <Text style={styles.itemsNameTxt}>Width</Text>
                <View style={styles.goodsTxtInputContainer}>
                  <TextInput
                      value={arrayOfItems[selectedItemIndex].width}
                      style={styles.txtInputValue}
                      placeholder={'0.0'}
                      keyboardType='decimal-pad'
                      returnKeyType='done'
                      onChangeText={(data) => {
                        const newValue = arrayOfItems.map((item, index) => {
                          if(index === selectedItemIndex){
                            return { ...item, width: data }
                          }
                          return item
                        })
                        setArrayOfItem(newValue)
                      }}
                  />
                  <Text style={styles.unitTxt}>| cm</Text>
                  <Text style={styles.errorTxt}>
                    {
                      arrayOfItems[selectedItemIndex].width &&
                        (
                          arrayOfItems[selectedItemIndex].width > 100 ? 'Max value is 100'
                        :
                          arrayOfItems[selectedItemIndex].width <= 0 ? 'Value must be above 0' : !(arrayOfItems[selectedItemIndex].width % 1 >= 0) && 'Invalid Input'
                        )
                    }
                  </Text>
                </View>                    
              </View>
              <View style={styles.packageItemsContainer}>
                <Text style={styles.itemsNameTxt}>Length</Text>
                <View style={styles.goodsTxtInputContainer}>
                  <TextInput
                    value={arrayOfItems[selectedItemIndex].length}
                    style={styles.txtInputValue}
                    placeholder={'0.0'}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                    onChangeText={(data) => {
                      const newValue = arrayOfItems.map((item, index) => {
                        if(index === selectedItemIndex){
                          return { ...item, length: data }
                        }
                        return item
                      })
                      setArrayOfItem(newValue)
                    }}
                  />
                  <Text style={styles.unitTxt}>| cm</Text>
                  <Text style={styles.errorTxt}>
                    {
                      arrayOfItems[selectedItemIndex].length &&
                        (
                          arrayOfItems[selectedItemIndex].length > 100 ? 'Max value is 100'
                        :
                          arrayOfItems[selectedItemIndex].length <= 0 ? 'Value must be above 0' : !(arrayOfItems[selectedItemIndex].length % 1 >= 0) && 'Invalid Input'
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
                    value={arrayOfItems[selectedItemIndex].weight}
                    style={styles.txtInputValue}
                    placeholder={'0.0'}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                    onChangeText={(data) => {
                      const newValue = arrayOfItems.map((item, index) => {
                        if(index === selectedItemIndex){
                          return { ...item, weight: data }
                        }
                        return item
                      })
                      setArrayOfItem(newValue)
                    }}
                  />
                  <Text style={styles.unitTxt}>| kg</Text>
                  <Text style={styles.errorTxt}>
                    {
                      arrayOfItems[selectedItemIndex].weight &&
                        (
                          arrayOfItems[selectedItemIndex].weight > 1000 ? 'Max value is 1000'
                        :
                          arrayOfItems[selectedItemIndex].weight <= 0 ? 'Value must be above 0' : !(arrayOfItems[selectedItemIndex].weight % 1 >= 0) && 'Invalid Input'
                        )
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.packageItemsContainer}>
                <Text style={styles.itemsNameTxt}>Heigth</Text>
                <View style={styles.goodsTxtInputContainer}>
                  <TextInput
                    value={arrayOfItems[selectedItemIndex].height}
                    style={styles.txtInputValue}
                    placeholder={'0.0'}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                    onChangeText={(data) => {
                      const newValue = arrayOfItems.map((item, index) => {
                        if(index === selectedItemIndex){
                          return { ...item, height: data }
                        }
                        return item
                      })
                      setArrayOfItem(newValue)
                    }}
                  />
                  <Text style={styles.unitTxt}>| cm</Text>
                  <Text style={styles.errorTxt}>
                    {
                      arrayOfItems[selectedItemIndex].height &&
                        (
                          arrayOfItems[selectedItemIndex].height > 100 ? 'Max value is 100'
                        :
                          arrayOfItems[selectedItemIndex].height <= 0 ? 'Value must be above 0' : !(arrayOfItems[selectedItemIndex].height % 1 >= 0) && 'Invalid Input'
                        )
                    }
                  </Text>
                </View>
              </View>

            </View>
          </View>
        </View>
        <View style={styles.btnContainer}>
        {/* Add Additional Items Button */}
          {/* Make button gray when not all inputs are filled out, orange when filled out */}
          {
            arrayOfItems.length === (selectedItemIndex + 1)  &&
              <TouchableOpacity 
                style={checkInputs() ? styles.nextButtonGray : styles.nextButtonOrange} 
                disabled={checkInputs()}
                onPress={() => {
                  setArrayOfItem([
                    ...arrayOfItems,
                    {
                      typeOfGoods: '',
                      productCategory: '',
                      productSubCategory: '',
                      packagingType: '',
                      quantity: 0,
                      width: '',
                      length: '',
                      weight: '',
                      height: '',
                    }
                  ])
                  setSelectedItemIndex(arrayOfItems.length)
                }}
              >
                <Text style={styles.buttonText}> Add Additional Items </Text>
              </TouchableOpacity>
          }
          {
            arrayOfItems.length != 1 &&
              <TouchableOpacity 
                style={[styles.nextButtonOrange, { backgroundColor: UMColors.red }]} 
                onPress={() => {
                  setArrayOfItem(arrayOfItems.filter((item, index) => {
                    if(index === selectedItemIndex){
                      if(selectedItemIndex !== 0){
                        setSelectedItemIndex(selectedItemIndex - 1)
                      } else {
                        setSelectedItemIndex(0)
                        updateItem()
                      }
                    } else {
                      return item
                    }
                  })) 
                }}
              >            
                <Text style={styles.buttonText}> Delete </Text>
              </TouchableOpacity>
          }

        {/* Next Button */}
          {
            arrayOfItems.length === (selectedItemIndex + 1)  &&
              <TouchableOpacity 
                style={(checkInputs() ? styles.nextButtonGray : styles.nextButtonOrange)} 
                disabled={checkInputs()}
                onPress={() => booking()}
              >            
                <Text style={styles.buttonText}> Next </Text>
              </TouchableOpacity>
          }
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
  bodyContainer: {
    alignItems: 'center',
    width: deviceWidth / 1.05,
    height: '70%',
    marginTop: 15
  },
  btnContainer: {
    width: '95%',
    height: '25%',
    marginTop: '2%',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 30,
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
    fontSize: normalize(TextSize('Normal')),
    textAlign: 'center',
    width: 30,
    color: UMColors.black,
    fontWeight: 'bold',
  },
  quantityButtonText: {
    fontSize: normalize(TextSize('M')),
    lineHeight: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  addButtonGray: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
  },
  addButtonOrange: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
  },
  nextButtonGray: {
    marginTop: '2%',
    height: '22%',
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
    marginTop: '2%',
    height: '22%',
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
    fontSize: normalize(TextSize('M')),
    fontWeight:'bold'
  },
  goodsDropDownContainer: {
    width: '95%',
    marginTop: '3%',
    alignItems: 'center',
    zIndex: 50
  },
  placeholderStyle: {
    fontSize: normalize(TextSize('Normal')),
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
    fontSize: normalize(TextSize('Normal')),
    fontWeight: 'bold'
  },
  packageDetailsContainer: {
    width: '95%',
    height: '22%',
    marginTop: '4%',
  },
  packageHalfContainer: {
    height: '35%',
    width: '100%',
    flexDirection: 'row',
    marginTop: '3%',
  },
  quantityContainer: {
    height: '28%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageItemsContainer: {
    height: '100%',
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemsNameTxt: {
    fontSize: normalize(TextSize('Normal')),
    marginRight: 10,
    marginLeft: '7%'
  },
  errorTxt: {
    color: UMColors.red, 
    position: 'absolute', 
    bottom: -17, 
    fontSize: normalize(TextSize('S')), 
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
    height: '80%',
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
    fontSize: normalize(TextSize('Normal')),
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
  itemDrawerContainer: {
    maxHeight: 50,
    width: '90%',
  },
  itemDrawerBtn: {
    backgroundColor: UMColors.primaryGray,
    paddingHorizontal: 19,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginRight: 5
  },
  itemTxt: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.white,
    fontWeight: 'bold'
  }
})