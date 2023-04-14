export const SAVE_LOGIN_DETAILS = "SAVE_LOGIN_DETAILS"
export const saveUserDetailsRedux = (data) => {
  return {
    type: SAVE_LOGIN_DETAILS,
    value: data
  }
}

export const SAVE_USER_DETAILS = "SAVE_USER_DETAILS"
export const saveUser = (data) => {
  return {
    type: SAVE_USER_DETAILS,
    value: data
  }
} 

export const SAVE_USER_PASS = "SAVE_USER_PASS"
export const saveUserPass = (data) => {
  return {
    type: SAVE_USER_PASS,
    value: data
  }
} 

export const USER_LOGOUT = "USER_LOGOUT"
export const userLogout = () => {
  return {
    type: USER_LOGOUT
  }
}

export const UPDATE_USER_ACCESS = "UPDATE_USER_ACCESS"
export const updateUserAccess = (data) => {
  return {
    type: UPDATE_USER_ACCESS,
    value: data
  }
}