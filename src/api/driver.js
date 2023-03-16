import { getStorage, setStorage } from "./helper/storage";
import environtment from "./environtment";

const baseURL = environtment.url

export class DriverApi {
  static async driverLocation(booknumber) {
    const API_URL = baseURL + '/api.bookings/driver-location'
    const user = await getStorage('user')
    console.log('access' + user.access)

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({booking_number: booknumber}) 
    })

    const result = await response.json()

    return result
  }
}