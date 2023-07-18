import React from 'react'
import { View, StyleSheet, Image, Text} from 'react-native'
import { UMIcons } from '../../utils/imageHelper';
import { UMColors } from '../../utils/ColorHelper';
import { TextSize, normalize } from '../../utils/stringHelper';

export const RouteDetails = ({ data, customHeight, white }) => {
  const bookingRoutes = data.booking_routes;
  const route = bookingRoutes[0];
  return (
    <View style={[styles.container, customHeight && styles.customHeight]}>
      {/* <Image style={{position: 'absolute', top: 25, width: normalize(27), zIndex: 0, height: normalize(40), resizeMode: 'contain'}} source={dots_icon}/> */}
      <View style={styles.firstRow}>
        <View style={styles.placeHolderContainer}>
          <Image style={styles.icon} source={UMIcons.pickUpIcon}/>
          <Text style={styles.placeHolderText}>Pick Up</Text>
        </View>
        <Text numberOfLines={2} adjustsFontSizeToFit={false} style={[styles.addressText, white && styles.textWhite]}>{route.origin_address + ', ' + route.origin_city + ', ' + route.origin_province}</Text>
      </View>
      <View style={styles.secondRow}>
        <View style={styles.placeHolderContainer}>
          <Image style={[styles.icon]} source={UMIcons.locationIcon}/>
          <Text style={styles.placeHolderText}>Destination</Text>
        </View>
        <Text numberOfLines={2} adjustsFontSizeToFit={false} style={[styles.addressText, white && styles.textWhite]}>{route.destination_address + ', ' + route.destination_city + ', ' + route.destination_province}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2
  },
  customHeight: {
    flex: 0,
    height: 140
  },
  placeHolderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  icon: {
    marginRight: 15,
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  infoContainer: {
    marginLeft: 10
  },
  placeHolderText: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.primaryOrange
  },
  addressText: {
    marginLeft: 40,
    height: 30,
    fontSize: normalize(TextSize('S'))
  },
  firstRow: {
    marginBottom: 10,
  },
  secondRow: {
    flex: 1
  },
  textWhite: {
    color: 'white'
  }
})