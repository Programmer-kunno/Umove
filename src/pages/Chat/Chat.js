import React, { useEffect, useState } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { ChatList } from './ChatList'
import { ChatSend } from './ChatSend'
import { ChatApi } from '../../api/chat'
import { setLoading } from '../../redux/actions/Loader'
import { dispatch } from '../../utils/redux'
import Socket from '../../api/helper/socket';
import { UMColors } from '../../utils/ColorHelper'

const Chat = (props) => {
  const accountNumber = props.route.params.data;

  const [id, setId] = useState(null);
  const [chats, setChats] = useState([]);
  const [state, setState] = useState(0);

  const { 
    sendJsonMessage,
    lastMessage,
    readyState 
  } = Socket(id);

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    setState(readyState)
  }, [readyState])

  useEffect(() => {
    if(lastMessage.data) {
      const newChats = [...chats];
      newChats.push(JSON.parse(lastMessage.data));
      setChats(newChats);
    }
  }, [lastMessage])

  const onPressSendChat = (value) => {
    sendJsonMessage({
      message: value
    })
  }

  const init = async () => {
    dispatch(setLoading(true));

    const response = await ChatApi.createMessage({ account_number: accountNumber })
    if(response?.data && response?.data?.success) {
      const dataToSet = response?.data?.data?.conversation_messages?.data;
      setChats(dataToSet?.reverse());
      setId(response?.data?.data?.id);
      dispatch(setLoading(false));
    } else {
      dispatch(setLoading(false));
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreView}>
        <View style={styles.messagesContainer}>
          <ChatList 
            data={chats} 
          />
        </View>
      </SafeAreaView>
      <ChatSend 
        state={state} 
        id={id} 
        sendChat={onPressSendChat}
      />
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: UMColors.white, 
    paddingBottom: 20
  },
  safeAreView: {
    flex: 1, 
    backgroundColor: UMColors.BGOrange
  },
  messagesContainer: {
    flex: 1
  }
})