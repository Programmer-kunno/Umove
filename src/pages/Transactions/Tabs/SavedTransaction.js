import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { BookingApi } from '../../../api/booking';
import ListComponent from '../../Components/ListComponent';

const SavedTransaction = () => {
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    setListLoading(false);

    // setListLoading(false);
    // setData([])

    // const response = await BookingApi.getBooking({ status: "saved" });
    // if(response == undefined){
    //   setListLoading(false);
    // } else {
    //   setListLoading(false);
    //   if(response?.data?.success) {
    //     setData(response.data.data);
    //   } else {
    //   }
    // }
  }

  return (
    <View style={styles.container}>
      <ListComponent 
        data={data}
        loading={listLoading}
        type={"saved"}
        refreshFunction={init}
      />
    </View>
  )
}

export default SavedTransaction

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})