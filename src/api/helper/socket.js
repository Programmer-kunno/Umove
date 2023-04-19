import React from 'react'
import { getAccessToken } from './userHelper';
import useWebSocket from 'react-native-use-websocket';
import environment from '../../api/environtment';

const socket = (id) => {
  const socketBaseURL = environment.socketUrl;
  const urlToConnect = `${socketBaseURL}/ws/messages/${id}`;

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState
  } = useWebSocket(urlToConnect, {
      options: {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      }
  });

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState
  }
}

export default socket