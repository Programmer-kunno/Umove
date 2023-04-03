import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { BookingApi } from '../../../api/booking';
import ListComponent from '../../Components/ListComponent';
import { refreshTokenHelper } from '../../../api/helper/userHelper';
import { dispatch } from '../../../utils/redux';
import { showError } from '../../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import ErrorOkModal from '../../Components/ErrorOkModal';

const PastTransaction = () => {
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    init();
  }, [])

  const init = () => {
    setListLoading(true);
    setData([]);

    refreshTokenHelper(async() => {
      const response = await BookingApi.getBooking({ status: "past" });
      if(response == undefined){
        setListLoading(false);
        dispatch(showError(true))
      } else {
        setListLoading(false);
        if(response?.data?.success) {
          setData(response.data.data);
        } else {
          setListLoading(false);
          setError({ value: true, message: response.data.message || response.data })
        }
      }
    }) 
  }

  return (
    <View style={styles.container}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error}
        ErrMsg={error.message}
        OkButton={() => {
          setError({ value: false, message: '' })
        }}
      />
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