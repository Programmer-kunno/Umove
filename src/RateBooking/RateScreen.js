import { 
  View, 
  Text, 
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import React, { useState } from 'react'
import { UMColors } from '../utils/ColorHelper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { UMIcons } from '../utils/imageHelper'
import { goBack, navigate, resetNavigation } from '../utils/navigationHelper'
import { dispatch } from '../utils/redux'
import { setLoading } from '../redux/actions/Loader'
import { refreshTokenHelper } from '../api/helper/userHelper'
import { BookingApi } from '../api/booking'
import { showError } from '../redux/actions/ErrorModal'
import ErrorWithCloseButtonModal from '../pages/Components/ErrorWithCloseButtonModal'
import { Loader } from '../pages/Components/Loader'
import ErrorOkModal from '../pages/Components/ErrorOkModal'

const deviceWidth = Dimensions.get('screen').width

export default RateScreen = (props) => {
  const bookingNumber = props.route.params?.bookingNumber
  const [review, setReview] = useState('')
  const [error, setError] = useState({ value: false, message: '' })
  const [rateValues, setRateValues] = useState([
    {
      value: 1,
      label: 'Fair',
      isPressed: false
    },
    {
      value: 2,
      label: 'Average',
      isPressed: false
    },
    {
      value: 3,
      label: 'Good',
      isPressed: false
    },
    {
      value: 4,
      label: 'Very Good',
      isPressed: false
    },
    {
      value: 5,
      label: 'Excellent',
      isPressed: false
    },
  ])

  const submitReview = () => {
    dispatch(setLoading(true))
    const selectedRate = rateValues.find((value) => value.isPressed == true)
    const data = {
      rating: selectedRate.value.toString(),
      review: review
    }
    refreshTokenHelper(async() => {
      const response = await BookingApi.RateBooking(data, bookingNumber)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          navigate('RateLoadingScreen', { bookingNumber: bookingNumber })
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar translucent barStyle={'light-content'}/>
        <ErrorWithCloseButtonModal/>
        <ErrorOkModal
          Visible={error.value}
          ErrMsg={error.message}
          OkButton={() => setError({ value: false, message: '' })}
        />
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => goBack()}
        >
          <Image
            style={{ width: 25, height: 25, tintColor: UMColors.white }}
            source={UMIcons.xIcon}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <View style={styles.rateBodyContainer}>
          <Text style={styles.rateTitle}>Rate your Experience</Text>
          <View style={styles.rateBtnContainer}>
            {
              rateValues.map((items, index) => (
                <View style={styles.rateBtnSubContainer} key={index}>
                  <TouchableOpacity
                    style={[styles.rateBtn, { backgroundColor: !items.isPressed ? UMColors.white : UMColors.primaryOrange}]}
                    onPress={() => {
                      let updatedList = rateValues.map((items2) => {
                        if(items2.value == items.value){
                          return { ...items2, isPressed: !items2.isPressed }
                        }
                        return { ...items2, isPressed: false }
                      })
                      setRateValues(updatedList)
                    }}
                  >
                    <Text style={[styles.ratebtnTxt, { color: !items.isPressed ? UMColors.black : UMColors.white }]}>
                      {items.value}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.rateLabel}>
                    {items.label}
                  </Text>
                </View>
              ))
            }
          </View>
          <TextInput
            style={styles.reviewInput}
            placeholder='Tell us more (Optional)'
            multiline={true}
            onChangeText={(value) => setReview(value)}
          /> 
          <TouchableOpacity 
            disabled={rateValues.filter((value) => value.isPressed == true).length === 0  ? true : false} 
            style={[styles.submitBtn, !(rateValues.filter((value) => value.isPressed == true).length === 0) && { backgroundColor: UMColors.primaryOrange }]}
            onPress={() =>{
              submitReview()
            }}
          >
            <Text style={styles.submitTxtBtn}>Submit</Text>
          </TouchableOpacity>
        </View>
        <Loader/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.black
  },
  exitBtn: {
    marginTop: '15%',
    marginLeft: 20,
    width: 25,
    height: 25,
  },
  rateBodyContainer: {
    width: deviceWidth,
    marginTop: '20%',
    alignItems: 'center'
  },
  rateTitle: {
    color: UMColors.white,
    alignSelf: 'center',
    fontSize: 22,
  },
  rateBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 60,
    width: '100%'
  },
  rateBtnSubContainer: {
    width: 35,
    height: 35,
    alignItems: 'center'
  },
  rateBtn: {
    backgroundColor: UMColors.white,
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ratebtnTxt: {
    color: UMColors.black,
    fontSize: 12
  },
  rateLabel: {
    color: UMColors.white,
    fontSize: 7,
    marginTop: 3
  },
  reviewInput: {
    backgroundColor: UMColors.white,
    width: '75%',
    marginTop: '15%',
    height: 130,
    fontSize: 13,
    paddingHorizontal: 10,
    textAlignVertical: 'top'
  },
  submitBtn: {
    backgroundColor: UMColors.primaryGray,
    width: deviceWidth / 2.0,
    height: 40,
    marginTop: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitTxtBtn: {
    color: UMColors.white,
    fontSize: 15,
    fontWeight: 'bold'
  }
})