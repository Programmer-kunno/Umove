export const IS_PAYMENT_SUCCESS = 'IS_PAYMENT_SUCCESS'
export const isPaymentSuccess = (data) => {
  return {
    type: IS_PAYMENT_SUCCESS,
    value: data
  }
}