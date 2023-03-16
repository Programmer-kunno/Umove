import { 
  post 
} from './helper/http';

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
  }

  static async confirmBooking(bookNumber) {
    const formData = new FormData()

    formData.append('booking_number', bookNumber)

    try {
      const response = await post('/api/bookings/update-status/confirmed', formData, { "Content-Type": "multipart/form-data" })
      return response.data
    } catch(err) {
      return err.data
    }
  }

  static async cancelBooking(bookNumber) {
    const formData = new FormData()

    formData.append('booking_number', bookNumber)

    try {
      const response = await post('/api/bookings/update-status/cancelled', formData, { "Content-Type": "multipart/form-data" })
      return response.data
    } catch(err) {
      console.log(err)
      return err
    }
  }

  static async quickQuotate(data) {
    try {
      const response = await post('/api/bookings/quick-quotation', data)
      return response.data
    } catch(err) {
      return err.data
    }
  }
}