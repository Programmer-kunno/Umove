import AsyncStorage from "@react-native-async-storage/async-storage"

export async function refreshAccessToken() {
  try {
    await AsyncStorage.getItem("user").then(response => {
      
    })
  } catch (err) {
  }
}