import { 
  post 
} from './helper/http';
import { getStorage, setStorage } from './helper/storage';
import { getAccessToken } from './helper/userHelper';
import environtment from './environtment';

const baseURL = environtment.url + '/api/'

export class BookingApi {
  
  static async quickQuotation(booking) {
    try {
      const response = await post('/api/bookings/quick-quotation', booking)
      return response.data
    } catch(err) {
      return err.data
    }
  }

  static async corporateExclusive(data) {
    const booking = data
    const pickUpDateTime = booking.pickupDate + " " + booking.pickupTime

    const bookingDetails = {
      "booking_type": booking.bookingType,
      "vehicle_type": booking.vehicleType,
      "pickup_time": pickUpDateTime,
      "signature_required": true,
      "booking_routes": [
        {
          "shipper": booking.pickupName,
          "origin_address": booking.pickupStreetAddress,
          "origin_region": booking.pickupRegion,
          "origin_province": booking.pickupProvince,
          "origin_city": booking.pickupCity,
          "origin_barangay": booking.pickupBarangay,
          "origin_zip_code": booking.pickupZipcode,
          "receiver": booking.dropoffName,
          "destination_address": booking.dropoffStreetAddress,
          "destination_region": booking.dropoffRegion,
          "destination_province": booking.dropoffProvince,
          "destination_city": booking.dropoffCity,
          "destination_barangay": booking.dropoffBarangay,
          "destination_zip_code": booking.dropoffZipcode,
        }
      ],
      "booking_items": [
        {
          "subcategory": booking.productSubcategory,
          "uom": booking.packagingType,
          "length": booking.length,
          "width": booking.width,
          "height": booking.height,
          "weight": booking.weight,
          "quantity": booking.quantity
        }
      ]
    }

    try {
      const response = await post('/api/bookings/book-delivery', bookingDetails)
      return response.data
    } catch(err) {
      return err.data
    }
  }

  static async computeRates(data) {
    try {
      const response = await post('/api/bookings/compute-rates', data)
      return response.data
    } catch(err) {
      return err.data
    }
    // let API_URL = baseURL + 'bookings/compute-rates';
    // let bookingConfirmation = await getStorage('bookingConfirmation')

    // const bookingData = {
    //   booking_number: bookingConfirmation.booking_number
    // }

    // console.log(bookingData)


    // const response = await fetch(API_URL ,{
    //     method: 'POST',
    //     headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${getAccessToken()}`,
    //             'Content-Type': 'application/json',
    //         },
    //     body: JSON.stringify(bookingData)
    //   });

    // const result = await response.json()

    // return result
  }

  static async confirmBooking() {
    let API_URL = baseURL + 'bookings/update-status/confirmed';
    let updateBooking = await getStorage('bookingRes')
    const user = await getStorage('user');
    const formData = new FormData()

    formData.append('booking_number', updateBooking.booking_number)


    const response = await fetch(API_URL ,{
        method: 'POST',
        headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`,
                'Content-Type': 'multipart/form-data',
            },
        body: formData
      });

    const result = await response.json()

    return result
  }

  static async cancelBooking(bookNumber) {
    let API_URL = baseURL + 'bookings/update-status/cancelled';
    const user = await getStorage('user');
    const formData = new FormData()

    formData.append('booking_number', bookNumber)


    const response = await fetch(API_URL ,{
        method: 'POST',
        headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`,
                'Content-Type': 'multipart/form-data',
            },
        body: formData
      });

    const result = await response.json()

    return result
  }

  static async quickQuotate(data) {
    let API_URL = baseURL + 'bookings/quick-quotation'

    const response = await fetch(API_URL ,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

  const result = await response.json()

  return result
    
  }
}