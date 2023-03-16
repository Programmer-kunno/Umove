import { 
  SAVE_LOGIN_DETAILS, 
  USER_LOGOUT,
  UPDATE_USER_ACCESS
} from "../actions/User";

const initialState = {
  userData: {}
}

export const userOperations = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_LOGIN_DETAILS: {
      return {
        ...state,
        userData: action.value,
      }
    }
    case USER_LOGOUT: {
      return {
       ...initialState
      }
    }
    case UPDATE_USER_ACCESS: {
      return {
        ...state,
        userData: {
          ...state.userData,
          access: action.value
        }
      }
    }
    default: 
      return state
  }
}