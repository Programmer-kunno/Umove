export const SAVE_BOOKING_DETAILS = 'SAVE_BOOKING_DETAILS'
export const saveBookingDetails = (data) => {
  return {
    type: SAVE_BOOKING_DETAILS,
    value: data
  }
}

export const CLEAR_BOOKING_DATA = 'CLEAR_BOOKING_DATA'
export const clearBookingDetails = (data) => {
  return {
    type: CLEAR_BOOKING_DATA,
    value: data
  }
}