import { Linking } from 'react-native';

export const openNumber = (phone) => {
  let phoneNumber = phone;
  phoneNumber = `tel://${phone}`;

  Linking.canOpenURL(phoneNumber)
  .then(supported => {
    if (!supported) {
    } else {
      return Linking.openURL(phoneNumber);
    }
  })
  .catch(err => console.log(err));
};