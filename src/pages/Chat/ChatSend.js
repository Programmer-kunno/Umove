import React, { useState } from 'react'
import { 
  View, 
  Image, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from 'react-native'
import { send_icon } from '../../assets'

export const ChatSend = (props) => {
  const [value, setValue] = useState('');
  
  const onPressSend = async () => {
    props.sendChat(value)
    setValue('');
  }

  const onChangeText = (value) => {
    setValue(value);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={value} 
          onChangeText={onChangeText}
          style={styles.input}
          placeholder='Send a Message'
          multiline={true}
        />
      </View>
      <TouchableOpacity disabled={props.state === 0} onPress={onPressSend} style={styles.sendButton}>
        <Image source={require('../../assets/icons/send_icon.png')} style={[styles.sendIcon, props.state === 0 && { tintColor: 'gray' }]}/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center'
  },
  inputContainer: {
    flex: 1, 
    height: 110, 
    paddingVertical: 15, 
    paddingHorizontal: 20
  },
  input: {
    flex: 1,
  },
  sendButton: {
    marginRight: 20
  },
  sendIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  }
})