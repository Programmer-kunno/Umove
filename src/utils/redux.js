import { store } from "../redux/store";

export const dispatch = (params) => {
  store.dispatch(params);
}

export const getState = () => {
  return store.getState();
}