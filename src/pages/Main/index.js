import React, {useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import {View} from 'react-native';
import Search from "../../components/Search";

function Main() {

  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    async function loadInitialPosition() {
      const {granted} = await requestPermissionsAsync();

      if (granted) {
        const {coords} = await getCurrentPositionAsync({
          enableHighAccuracy: true,
          maximumAge: 1000
        });

        const {latitude, longitude} = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134,
        })
      }

    }

    loadInitialPosition();
  }, []);

  if (!currentRegion) {
    return null;
  }

  return <View style={{flex: 1}}>
    <MapView
      style={{flex: 1}}
      initialRegion={currentRegion}
      showsUserLocation={true}
      loadingEnabled={true}
    />
    <Search/>
  </View>
}

export default Main

