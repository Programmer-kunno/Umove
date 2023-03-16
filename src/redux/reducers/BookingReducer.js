import { 
  SAVE_BOOKING_DETAILS,
  CLEAR_BOOKING_DATA
} from "../actions/Booking";

const initialState ={
  booking: {}
}

export const bookingDetails = (state = initialState, action) => {
  switch(action.type) {
    case SAVE_BOOKING_DETAILS: {
      return {
        ...action,
        booking: action.value
      }
    }
    case CLEAR_BOOKING_DATA: {
      return {
        ...initialState
      }
    }
    default: 
      return state
  }
}