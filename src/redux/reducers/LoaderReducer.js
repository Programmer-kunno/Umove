import { 
  SET_LOADING 
} from "../actions/Loader";

const initialState ={ 
  loading: false
}

export const loadingReducer = (state = initialState, action) => {
  switch(action.type){
    case SET_LOADING: {
      return {
        ...state,
        loading: action.value
      }
    }
    default:
      return state
  }
}