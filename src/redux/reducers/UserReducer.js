import { 
  SAVE_LOGIN_DETAILS, 
  SAVE_USER_DETAILS,
  SAVE_USER_PASS,
  USER_LOGOUT,
  UPDATE_USER_ACCESS,
  SAVE_USER_CHANGES,
  FOR_UPDATE_USER_DATA
} from "../actions/User";

const initialState = {
  userData: {},
  userDetailsData: {},
  logInData: {},
  userChangesData: {},
  updateUserData: {}
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
    case SAVE_USER_CHANGES: {
      return {
        ...state,
        userChangesData: action.value
      }
    }
    case FOR_UPDATE_USER_DATA: {
      return {
        ...state,
        updateUserData: action.value
      }
    }
    default: 
      return state
  }
}