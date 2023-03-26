import { CommonActions } from "@react-navigation/native";

let navigationRef;

export const setTopNavigationRef = (ref) => {
  navigationRef = ref;
}

export const navigate = (name, data) => {
  navigationRef.navigate(name, data)
}

export const resetNavigation = (name) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: name }
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