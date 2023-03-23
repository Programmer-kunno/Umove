import React from 'react'
import { Platform } from 'react-native';
import { AvoidSoftInputView } from "react-native-avoid-softinput";

const KeyboardAvoidingView = (props) => {
  if(Platform.OS === "android") {
    return props.children
  }

  return (
    <AvoidSoftInputView
      avoidOffset={10}
      easing="easeIn"
      hideAnimationDelay={100}
      hideAnimationDuration={300}
      showAnimationDelay={100}
      showAnimationDuration={800}
      style={{flex: 1}}
    >
      {props.children}
    </AvoidSoftInputView>
  )
}

export default KeyboardAvoidingView