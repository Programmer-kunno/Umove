import { get } from "./helper/http"

export class DriverApi {
  static async driverLocation(booknumber) {
    try {
      const response = await get(`/api/bookings/driver-location/${booknumber}`, {}, false)
      return response
    } catch(err) {
      return err
    }
  }
}