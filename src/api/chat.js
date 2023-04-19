import { 
  post,
  get
} from './helper/http';

export class ChatApi {
  static async createMessage(data) {
    try {
      const response = await post(`/api/messages/create`, data)   
      return response
    } catch(err) {
      return err
    }
  }
}