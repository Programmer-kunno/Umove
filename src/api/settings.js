import { 
  get 
} from "./helper/http";

export class SettingsApi {
  
  static async settings() {
    try {
      const response = get('/api/settings', {}, true)
      return response
    } catch(err) {
      return err
    }
  }
}