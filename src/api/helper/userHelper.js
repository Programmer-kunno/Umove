import { getState } from "../../utils/redux";

export const getAccessToken = () => {
  const user = getState().userOperations.userData;
  return user.access
}

export const getRefreshToken = () => {
  const user = getState().userOperations.userData;
  return user.refresh
}