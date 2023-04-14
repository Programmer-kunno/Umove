import { 
  SAVE_APP_MOUNTED
} from "../actions/AppState";

const initialState = {
  appMounted: false
}

export const appState = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_APP_MOUNTED: {
      return {
        ...state,
        appMounted: action.value,
      }
    }
    default: 
      return state
  }
}