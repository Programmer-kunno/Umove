import { 
  SHOW_ERROR 
} from "../actions/ErrorModal";

const initialState = {
  showError: false
}

export const showErrorReducer = (state = initialState, action) => {
  switch(action.type) {
    case SHOW_ERROR: {
      return {
        ...state,
        showError: action.value
      }
    }
    default:
      return state
  }
}