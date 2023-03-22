import { 
  post,
  get
} from './helper/http';

export class BookingApi {
  
  static async quickQuotation(booking) {
    try {
      const response = await post('/api/bookings/quick-quotation', booking)
      return response
    } catch(err) {
      return err
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
      const response = await post(`/api/bookings/update-status/${bookNumber}`, formData, { "Content-Type": "multipart/form-data" })
      return response
    } catch(err) {
      return err
    }
  }

  static async cancelBooking(bookNumber) {
    const formData = new FormData()

    formData.append('status', 'cancelled')

    try {
      const response = await post(`/api/bookings/update-status/${bookNumber}`, formData, { "Content-Type": "multipart/form-data" })
      return response
    } catch(err) {
      return err
    }
  }

  static async quickQuotate(data) {
    try {
      const response = await post('/api/bookings/quick-quotation', data)
      return response
    } catch(err) {
      return err
    }
  }
}