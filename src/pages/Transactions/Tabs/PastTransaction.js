import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { BookingApi } from '../../../api/booking';
import ListComponent from '../../Components/ListComponent';

const PastTransaction = () => {
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    setListLoading(true);
    setData([]);

    const response = await BookingApi.getBooking({ status: "past" });
    if(response == undefined){
      setListLoading(false);
    } else {
      setListLoading(false);
      if(response?.data?.success) {
        setData(response.data.data);
      } else {
      }
    }
  }

  return (
    <View style={styles.container}>
      <ListComponent 
        data={data}
        loading={listLoading}
        type={"past"}
        refreshFunction={init}
      />
    </View>
  )
}

export default PastTransaction

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})