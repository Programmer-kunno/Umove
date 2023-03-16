import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import RBSheet from "react-native-raw-bottom-sheet";

export default CustomerServiceModal = () => {
  const RBSheet = useRef(null)

  return (
    <RBSheet
      ref={ref => RBSheet = ref}
      height={300}
      openDuration={250}
      customStyles={{
        container: {
          justifyContent: "center",
          alignItems: "center",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }
      }}
    >

    </RBSheet>
  )
}
