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
  let theMoney = money || 0;

  const newMoney = theMoney.toFixed(2).toString();
  return newMoney.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const mobileNumberRegex = (mobileNumber) => {
  const mobileRegex = /^(09|\+639)\d{9}$/
  return mobileRegex.test(mobileNumber)
}

export const cardExpiryDateRegex = (expiryDate) => {
  return expiryDate.replace(/^(\d{2})(\d{2})/, '$1/$2')
}

export const cardNumberRegex = (cardNumber) => {
  return cardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()
}

export const capitalizeFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const reArrangeDate = (date) => {
  let splittedDate = date.split('-')
  let arrangedDate = splittedDate[1] + '-' + splittedDate[2] + '-' + splittedDate[0]
  return arrangedDate 
}

export const make12HoursFormat = (time) => {
  let splittedTime = time.split(':')
  let hours = parseInt(splittedTime[0]);
  let minutes = splittedTime[1];
  let seconds = splittedTime[2];

  let meridian
  let newHour
  if(hours >= 12){
    console.log(hours);
    console.log(hours === 2);
    newHour = hours === 12 ? hours : hours - 12
    meridian = 'PM'
  } else if(hours === 0) {
    newHour = 12;
    meridian = 'AM'
  } else {
    newHour = hours
    meridian = 'AM'
  }

  return `${newHour}` + ':' + minutes + (seconds ? `:${seconds}` : '') + ' ' + meridian
}