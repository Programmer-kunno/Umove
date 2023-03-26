import { 
  post,
  get,
  patch
} from './helper/http';

export class CardPayment {
  static async getPaymentMetods() {
    try {
      const response = await get(`/api/payments/methods`, {}, false)
      return response
    } catch(err) {
      return err
    }
  }

  static async addPaymentMethod(data) {
    try {
      const response = await post(`/api/payments/methods/create`, data)
      return response
    } catch(err) {
      return err
    }
  }

  static async  updatePaymentMethod(paymentMethodId) {
    try {
      const response = await patch(`/api/payments/methods/update/${paymentMethodId}`, { is_default: true })
      return response
    } catch(err) {
      return err
    }
  }
}