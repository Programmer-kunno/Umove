import { 
  SAVE_LOGIN_DETAILS, 
  SAVE_USER_DETAILS,
  SAVE_USER_PASS,
  USER_LOGOUT,
  UPDATE_USER_ACCESS
} from "../actions/User";

const initialState = {
  userData: {},
  userDetailsData: {},
  logInData: {}
}

export const userOperations = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_LOGIN_DETAILS: {
      return {
        ...state,
        userData: action.value,
      }
    }
    case SAVE_USER_DETAILS: {
      return {
        ...state,
        userDetailsData: action.value
      }
    }
    case SAVE_USER_PASS: {
      return {
        ...state,
        logInData: action.value
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