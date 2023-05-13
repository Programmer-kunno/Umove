import { 
  post 
} from "./helper/http";

export class PayCreditApi {
  static async chequePayment(data) {
    const formdata = new FormData()

    if(data.cheque) {
      const newData = data.cheque;
      newData.mimeType = newData.type
      formdata.append('cheque', { uri: newData?.uri, name: newData?.name, type: newData?.mimeType })
    }

    formdata.append('address', data.address)
    formdata.append('region', data.region)
    formdata.append('province', data.province)
    formdata.append('city', data.city)
    formdata.append('barangay', data.barangay)
    formdata.append('zip_code', data.zipCode)

    try {
      const response = await post('/api/credits/pay/cheque', formdata, { 'Content-Type': 'multipart/form-data '})
      return response
    } catch(err) {
      return err
    }
  }

  static async creditOnlinePayment(data) {
    console.log(data)
    try {
      const response = await post('/api/credits/pay', data)
      return response
    } catch(err) {
      return err
    }
  }
}