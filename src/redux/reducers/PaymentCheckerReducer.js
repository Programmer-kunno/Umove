import { 
  IS_PAYMENT_SUCCESS 
} from "../actions/PaymentChecker";

const initialState = {
  payment: ''
}

export const paymentCheckerReducer = (state = initialState, action) => {
  switch(action.type){
    case IS_PAYMENT_SUCCESS: {
      return {
        ...state,
        payment: action.value
      }
    }
    default:
      return state
  }
}