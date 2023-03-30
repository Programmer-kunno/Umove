import React, { useState } from 'react'
import { View, Text, useWindowDimensions, TouchableOpacity, StyleSheet } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view';
import { UMColors } from '../../utils/ColorHelper';
import OngoingTransaction from './Tabs/OngoingTransaction';
import PastTransaction from './Tabs/PastTransaction';
import SavedTransaction from './Tabs/SavedTransaction';

const renderScene = SceneMap({
  Ongoing: OngoingTransaction,
  Past: PastTransaction,
  Saved: SavedTransaction
});

const TransactionTabs = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = useState([
    { key: 'Ongoing', title: 'Ongoing' },
    { key: 'Past', title: 'Past' },
    { key: 'Saved', title: 'Saved' },
  ]);

  const renderTabBar = (value) => {
    const onPressTab = (item) => {
      value.jumpTo(item.key)
    }

    return <View style={styles.container}>
      {
        value.navigationState.routes.map((item, itemIndex) => (
          <View style={[styles.buttonContainer, itemIndex === 1 && styles.midButton]}>
            <TouchableOpacity activeOpacity={1} onPress={() => onPressTab(item)} style={styles.buttonStlye}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
            <View style={[styles.buttonIndicator, index !== itemIndex && { backgroundColor: UMColors.white }]}/>
          </View>
        ))
      }
    </View>
  }

  return (
    <TabView
      lazy
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  )
}

export default TransactionTabs

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    padding: 5
  }, 
  buttonContainer: {
    flex: 1
  },
  midButton: { 
    marginHorizontal: 2 
  },
  buttonStlye: {
    paddingVertical: 15, 
    alignItems: 'center', 
    backgroundColor: UMColors.white
  },
  buttonIndicator: {
    height: 5, 
    backgroundColor:
    UMColors.primaryOrange
  }
})