import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator, StyleSheet} from 'react-native'
import { OneBookingCard } from '../../../Components/BookingCalendarCard';
import { List } from '../../../Components/List';
import { refreshTokenHelper } from '../../../../api/helper/userHelper';
import { BookingApi } from '../../../../api/booking';

export const Bookings = ({ selectedDate }) => {
  const [next, setNext] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if(selectedDate) {
      init();
    } else {
      setLoading(false)
    }
  }, [selectedDate])

  const init = async () => {
    setLoading(true);
    setData([]);

    refreshTokenHelper(async () => {
      const response = await BookingApi.getBooking({ pickup_date: selectedDate });
      console.log(response?.data)
      if(response?.data && response.data.success) {
        setData(response?.data?.data);
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
  }

  const fetchAgain = async () => {
    if(next) {
      refreshTokenHelper(async () => {
        const splitedNext = next.split("/");
        const params = splitedNext[splitedNext.length - 1];
        const response = await getByURL(params);
        if(response?.data && response?.data.success) {
          setNext(response.data.next ? response.data.next : '');
          setData([...data, ...response.data.data]);
        }
      })
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <OneBookingCard 
        data={item}
        disabled
        index={index}
        length={data.length}
      />
    )
  }

  return (
    <View style={styles.contatiner}>
      <List 
        data={data}
        loading={loading}
        renderItem={renderItem}
        onRefresh={init}
        fetchAgain={fetchAgain}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contatiner: {
    flex: 1, 
    marginTop: 10, 
    paddingHorizontal: 30
  },
  listEmptyContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingBottom: 30
  },
  listEmptyText: { 
    color: 'white', 
    fontWeight: "bold", 
    fontSize: 20
  }
})