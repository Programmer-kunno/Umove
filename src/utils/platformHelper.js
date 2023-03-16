import { Platform } from "react-native"

/**
 * A function that return if you're using IOS.
 * 
 * @returns {boolean}
 */
export const isOSIOS = () => {
    const OS = Platform.OS;
    return OS === 'ios';
}