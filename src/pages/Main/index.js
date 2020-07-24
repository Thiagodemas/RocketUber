import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import {View} from 'react-native';
import Search from "../../components/Search";
import Directions from "../../components/Directions";
import markerImage from '../../assets/marker.png';
import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall
} from "./styles";


function Main() {

  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [currentDuration, setCurrentDuration ] = useState("");
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

  async function handleLocationSelected(data, {geometry}) {
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
      ref={mapView}>

      {currentDestination && (
        <>
          <Directions
            origin={currentRegion}
            destination={currentDestination}
            onReady={result => {
              setCurrentDuration( Math.floor(result.duration));
              console.log("currentDuration", currentDuration );
              mapView.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: 80,
                  left: 80,
                  top: 80,
                  bottom: 350
                }
              });
            }}
          />
          <Marker
            coordinate={currentDestination}

            image={markerImage}
          >
            <LocationBox>
              <LocationText>{currentDestination.title}</LocationText>
            </LocationBox>
          </Marker>
          <Marker coordinate={currentRegion} >
            <LocationBox>
              <LocationTimeBox>
                <LocationTimeText>{currentDuration}</LocationTimeText>
                <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
              </LocationTimeBox>
              <LocationText>Felipe Cortez, 867</LocationText>
            </LocationBox>
          </Marker>
        </>
      )}

    </MapView>
    <Search onLocationSelected={handleLocationSelected}/>
  </View>
}

export default Main

