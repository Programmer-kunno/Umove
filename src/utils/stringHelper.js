/**
 * A function to validate if email is valid.
 * 
 * @param {email} - The email we need to validate.
 * @returns {boolean}
 */
export const emailRegex = (email) => {
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(email);
}

export const moneyFormat = (money) => {
  const newMoney = money.toFixed(2).toString();
  return newMoney.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const mobileNumberRegex = (mobileNumber) => {
  const mobileRegex = /^(09|\+639)\d{9}$/
  return mobileRegex.test(mobileNumber)
}