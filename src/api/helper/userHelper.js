import { getState } from "../../utils/redux";
import jwtDecode from "jwt-decode";
import { CustomerApi } from "../customer";
import { dispatch } from "../../utils/redux";
import { updateUserAccess, userLogout } from "../../redux/actions/User";
import { resetNavigation } from "../../utils/navigationHelper";

export const getAccessToken = () => {
  const user = getState().userOperations.userData;
  return user.access
}

export const getRefreshToken = () => {
  const user = getState().userOperations.userData;
  return user.refresh
}

export const refreshTokenHelper = async(callback) => {
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const decodedToken = jwtDecode(access)
  const expiry = decodedToken.exp
  const isExpired = (expiry * 1000) >= new Date().getTime()
  if(isExpired){
    const data = {
      refresh: refresh
    }
    const response = await CustomerApi.refreshAccess(data)
    if(response?.data?.success){
      dispatch(updateUserAccess(response?.data?.data?.access))
      callback?.()
    } else {
      dispatch(userLogout())
      resetNavigation('Landing')
    }
  } else {
    callback?.()
  }
}
