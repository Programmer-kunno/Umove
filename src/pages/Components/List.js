import React, { useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { FlatList, RefreshControl } from 'react-native-gesture-handler'
import { TextSize, normalize } from '../../utils/stringHelper';

export const List = ({
  data,
  loading,
  renderItem,
  fetchAgain,
  onRefresh
}) => {
  const onEndReachedCalledDuringMomentum = useRef(false);

  const returnListEmpty = () => {
    if(loading) {
      return <View style={styles.listEmptyContainer}>
        <ActivityIndicator
          size={"large"}
          color={"white"}
        />
      </View>
    } else {
      return (
        <View style={styles.listEmptyContainer}>
          <Text style={styles.listEmptyText}>No data to show</Text>
        </View>
      )
    }
  }

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = true;
  }

  const onEndReached = () => {
    if(onEndReachedCalledDuringMomentum) {
      fetchAgain?.();
      onEndReachedCalledDuringMomentum.current = false;
    }
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={returnListEmpty}
        contentContainerStyle={(loading || data.length === 0) && {flex: 1}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={false}
            onRefresh={onRefresh}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={onMomentumScrollBegin}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    fontSize: normalize(TextSize('L'))
  }
})