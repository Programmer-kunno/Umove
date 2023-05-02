import { PermissionsAndroid, Platform } from 'react-native';

export const canWriteMedia = async () => {
  if(Platform.OS === "ios") return true;
  const OSVER = Platform.constants['Release'];
  let granted
  if(OSVER <= 12) {
    granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  } else {
    granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
  }

  return granted === 'granted'
}

export const canReadMedia = async () => {
  if(Platform.OS === "ios") return true;
  const OSVER = Platform.constants['Release'];
  let granted
  if(OSVER <= 12) {
    granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
  } else {
    granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
  }

  return granted === 'granted'
}

export const canAccessCamera = async () => {
  if(Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Camera Permission",
        message:"UMove needs access to your camera ",
        buttonPositive: "OK",
        buttonNegative: "Cancel"
      }
    );
  
    return granted === 'granted';
  } else {
    const granted = await request(PERMISSIONS.IOS.CAMERA);

    return granted;
  }
}