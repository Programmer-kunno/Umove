import React, { useEffect, useRef } from 'react'
import { FlatList } from 'react-native'
import { Bubbles } from './Bubbles'

export const ChatList = ({ data }) => {
  const chatListRef = useRef(undefined);
  
  useEffect(() => {
    if(data.length && data.length !== 0) {
      chatListRef.current.scrollToIndex({ animated: true, index: (data.length - 1), viewPosition: 0 })
    }
  }, [data])
  
  const renderItem = ({ item, index }) => {
    return (
      <Bubbles
        dataLength={data.length}
        index={index}
        item={item}
      />
    )
  }

  return (
    <FlatList
      ref={chatListRef}
      data={data}
      renderItem={renderItem}
      onScrollToIndexFailed={() => {
        setTimeout(() => {
          chatListRef.current.scrollToIndex({ animated: true, index: (data.length - 1), viewPosition: 0 })
        }, 300)
      }}
    />
  )
}