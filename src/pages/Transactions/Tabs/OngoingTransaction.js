import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { BookingApi } from '../../../api/booking';
import BookingCard from '../../Components/BookingCard';

const OngoingTransaction = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    const response = await BookingApi.getBooking({ status: "confirmed" });
    if(response == undefined){
    } else {
      if(response?.data?.success) {
        setData(response.data.data);
      } else {
      }
    }
  }

  const renderItem = ({ item, index }) => {
    return <BookingCard 
      index={index} 
      data={item} 
      length={data.length} 
      />
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={data}
        renderItem={renderItem}
      />
    </View>
  )
}

export default OngoingTransaction

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})