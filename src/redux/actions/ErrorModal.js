export const SHOW_ERROR = 'SHOW_ERROR'
export const showError = (data) => {
  return{
    type: SHOW_ERROR,
    value: data
  }
}