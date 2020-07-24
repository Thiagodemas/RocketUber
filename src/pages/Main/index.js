import React, {useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import {View} from 'react-native';
import Search from "../../components/Search";
import Directions from "../../components/Directions";

function Main() {

  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentDestination, setCurrentDestination] = useState(null);


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
  async function handleLocationSelected(data, { geometry }) {
    const {
      location: {
        lat: latitude,
        lng: longitude
      }
    } = geometry;

    setCurrentDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text
    });
  }

  return <View style={{flex: 1}}>
    <MapView
      style={{flex: 1}}
      initialRegion={currentRegion}
      showsUserLocation={true}
      loadingEnabled={true} >

      {currentDestination && (
        <Directions
          origin={currentRegion}
          destination={currentDestination}
          onReady={ () => {}}
        />
      )}

    </MapView>
    <Search onLocationSelected={handleLocationSelected} />
  </View>
}

export default Main

