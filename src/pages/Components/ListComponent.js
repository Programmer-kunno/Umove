import React from 'react'
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, RefreshControl } from 'react-native'
import BookingCard from './BookingCard';
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';

const ListComponent = (props) => {
  const { data, loading, type, refreshFunction } = props;
  
  const renderItem = ({ item, index }) => {
    return <BookingCard
      index={index} 
      keyProp={`${index}_${type}`}
      data={item} 
      length={data.length} 
      type={type}
    />
  }
  
  const ListEmptyComponent = () => {
    const firstTypeLetter = type.slice(0, 1);
    const adjustedType = firstTypeLetter.toUpperCase() + type.slice(1, type.length) 
    if(loading) {
      return <View style={styles.listEmptyContainer}>
        <ActivityIndicator size={'large'} color={UMColors.primaryOrange}/>
      </View>
    } else {
      return (
        <View style={styles.listEmptyContainer}>
          <Image 
            source={UMIcons.no_booking}
            style={styles.noDataIcon}
          />
          <Text style={styles.noDataText}>You don't have{'\n'}{adjustedType} Booking</Text>
        </View>
      )
    }
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.key}
      refreshControl={
        <RefreshControl 
          refreshing={false}
          onRefresh={refreshFunction}
        />
      } 
      contentContainerStyle={(loading || data.length === 0) && { flex: 1 }}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
    />
  )
}

export default ListComponent

const styles = StyleSheet.create({
  listEmptyContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  noDataIcon: {
    height: 70, 
    width: 70, 
    marginBottom: 10
  },
  noDataText: {
    textAlign: 'center', 
    color: '#8E8E8E', 
    fontSize: 15
  }
})