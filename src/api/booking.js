import { 
  post,
  get
} from './helper/http';

export class BookingApi {

  static async RateBooking(data, bookingNumber) {
    try {
      const response = await post(`/api/bookings/ratings/create/${bookingNumber}`, data, {}, false)
      return response
    } catch(err) {
      return err
    }
  }
  
  static async quickQuotation(bookingData) {

    const data = {
      "vehicle_type": bookingData.vehicleType,
      "booking_routes":  [
        {
          "origin_address": bookingData.pickupStreetAddress,
          "origin_region": bookingData.pickupRegion,
          "origin_province": bookingData.pickupProvince,
          "origin_city": bookingData.pickupCity,
          "origin_barangay": bookingData.pickupBarangay,
          "origin_zip_code": bookingData.pickupZipcode,
          "origin_latitude": bookingData.pickupLatitude,
          "origin_longitude": bookingData.pickupLongitude,
          "destination_address": bookingData.dropoffStreetAddress,
          "destination_region": bookingData.dropoffRegion,
          "destination_province": bookingData.dropoffProvince,
          "destination_city": bookingData.dropoffCity,
          "destination_barangay": bookingData.dropoffBarangay,
          "destination_zip_code": bookingData.dropoffZipcode,
          "destination_latitude": bookingData.dropoffLatitude,
          "destination_longitude": bookingData.dropoffLongitude,
        }
      ],
      "booking_items":  [
        {
          "subcategory": bookingData.productSubcategory,
          "uom": bookingData.packagingType,
          "length": bookingData.length,
          "width": bookingData.width,
          "height": bookingData.height,
          "weight": bookingData.weight,
          "quantity": bookingData.quantity
        }
      ]
    }

    try {
      const response = await post('/api/bookings/quick-quotation', data, {}, true)
      return response
    } catch(err) {
      return err
    }
  }

  static async getBookingRoutes(bookNumber) {
    try {
      const response = await get(`/api/bookings/route/${bookNumber}`, {}, false)
      return response
    } catch (err) {
      return err
    }
  }

  static async getAddressLocation(address) {
    try {
      const response = await post('/api/bookings/location', address, {}, true)
      return response
    } catch (err) {
      return err
    }
  }

  static async payBooking(bookNumber, data) {
    try {
      const response = await post(`/api/bookings/pay/${bookNumber}`, data, {}, false)   
      return response
    } catch(err) {
      return err
    }
  }

  static async book(data) {

    let pickUpTime = data.pickupDate + ' ' + data.pickupTime

    const bookingDetails = {
      "booking_type": data.bookingType,
      "charge_type": data.chargeType,
      "vehicle_type": data.vehicleType,
      "pickup_time": pickUpTime,
      "signature_required": data.isSignatureRequired,
      "booking_routes": [
        {
          "shipper": data.pickupName,
          "origin_address": data.pickupStreetAddress,
          "origin_region": data.pickupRegion,
          "origin_province": data.pickupProvince,
          "origin_city": data.pickupCity,
          "origin_barangay": data.pickupBarangay,
          "origin_zip_code": data.pickupZipcode,
          "origin_landmark": data.pickupLandmark,
          "origin_special_instructions": data.pickupSpecialInstructions,

          "receiver": data.dropoffName,
          "destination_address": data.dropoffStreetAddress,
          "destination_region": data.dropoffRegion,
          "destination_province": data.dropoffProvince,
          "destination_city": data.dropoffCity,
          "destination_barangay": data.dropoffBarangay,
          "destination_zip_code": data.dropoffZipcode,
          "destination_landmark": data.dropoffLandmark,
          "destination_special_instructions": data.dropoffSpecialInstructions,

          "origin_latitude": data.pickupLatitude.toString(),
          "origin_longitude": data.pickupLongitude.toString(),
          "destination_latitude": data.dropoffLatitude.toString(),
          "destination_longitude": data.dropoffLongitude.toString(),
        }
      ],
      "booking_items": [
        {
          "subcategory": data.productSubcategory,
          "uom": data.packagingType,
          "length": data.length,
          "width": data.width,
          "height": data.height,
          "weight": data.weight,
          "quantity": data.quantity
        }
      ]
    }

    console.log(bookingDetails)
    
    try {
      const response = await post('/api/bookings/book-delivery', bookingDetails, {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async computeRates(data) {
    try {
      const response = await get(`/api/bookings/compute-rates/${data.booking_number}`, {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async confirmBooking(bookNumber) {
    const formData = new FormData()

    formData.append('status', 'confirmed')

    try {
      const response = await post(`/api/bookings/update-status/${bookNumber}`, formData, { "Content-Type": "multipart/form-data" }, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async cancelBooking(bookNumber) {
    const formData = new FormData()

    formData.append('status', 'cancelled')

    try {
      const response = await post(`/api/bookings/update-status/${bookNumber}`, formData, { "Content-Type": "multipart/form-data" }, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async getBooking(params) {
    let parameters = "?";
  
    if(params.type) {
      parameters += `type=${params.type}&`
    }

    if(params.page) {
      parameters += `page=${params.page}&`
    }

    if(params.status) {
      parameters += `status=${params.status}&`
    }

    if(params.pickup_date) {
      parameters += `pickup_date=${params.pickup_date}&`
    }

    if(params.booking_number) {
      parameters = params.booking_number + '&'
    }

    try {
      const response = await get('/api/bookings/' + parameters.slice(0, -1));
      return response;
    } catch(err) {
      return err
    }
  }
}