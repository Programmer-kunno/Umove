import { CommonActions } from "@react-navigation/native";

let navigationRef;

export const setTopNavigationRef = (ref) => {
  navigationRef = ref;
}

export const navigate = (name, data) => {
  navigationRef.navigate(name, data)
}

export const resetNavigation = (name, data) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: name, params: data }
      ]
    })
  );
}

export const goBack = () => {
  navigationRef.goBack();
}

export const pop = (value) => {
  navigationRef.pop(value)
}

export const focusedScreenName = () => {
  return navigationRef.getCurrentRoute().name
}