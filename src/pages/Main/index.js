import React, {useEffect, useState, useRef} from 'react';
import MapView from 'react-native-maps';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import {View} from 'react-native';
import Search from "../../components/Search";
import Directions from "../../components/Directions";

function Main() {

  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
    const mapView = useRef(null);


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
      loadingEnabled={true}
      ref={mapView} >

      {currentDestination && (
        <Directions
          origin={currentRegion}
          destination={currentDestination}
          onReady={result => {
            setCurrentDuration({ currentDuration: Math.floor(result.currentDuration) });
            setCurrentResult({currentResult: result});
            mapView.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 50,
                left: 50,
                top: 50,
                bottom: 350
              }
            });
          }}
        />
      )}

    </MapView>
    <Search onLocationSelected={handleLocationSelected} />
  </View>
}

export default Main

