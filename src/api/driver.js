import { post } from "./helper/http"

export class DriverApi {
  static async driverLocation(booknumber) {
    try {
      const response = await post('/api/bookings/driver-location', { booking_number: booknumber })
      return response
    } catch(err) {
      return err
    }
  }
}