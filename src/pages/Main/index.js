import React, {useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import {View, Image} from 'react-native';
import Search from "../../components/Search";
import Directions from "../../components/Directions";
import Details from "../../components/Details";
import markerImage from '../../assets/marker.png';
import Geocoder from "react-native-geocoding";
import { Back, LocationBox, LocationText, LocationTimeBox, LocationTimeText, LocationTimeTextSmall } from "./styles";
import backImage from "../../assets/back.png";

Geocoder.init("");

function Main() {

  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [currentDuration, setCurrentDuration ] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
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
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034,
        });
        address(latitude, longitude);
      }
    }
    async function address(latitude, longitude){

      const response = await Geocoder.from({latitude, longitude})
      const address = response.results[0].formatted_address;
      setCurrentLocation(address.substring(0, address.indexOf(",")));
    }

    loadInitialPosition();
  }, []);

  if (!currentRegion) {
    return null;
  }
  async function handleBack() {
    setCurrentDestination( null );
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
      { currentDestination && (
        <>
          <Directions
            origin={currentRegion}
            destination={currentDestination}
            onReady={result => {
              setCurrentDuration( Math.floor(result.duration));
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
          <Marker coordinate={currentDestination} image={markerImage}>
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
              <LocationText>{currentLocation}</LocationText>
            </LocationBox>
          </Marker>
        </>
      )}
    </MapView>
    { currentDestination ? (
      <>
        <Back onPress={handleBack}>
          <Image source={backImage} />
        </Back>
        <Details />
      </>
    ) : (
      <Search onLocationSelected={handleLocationSelected}/>
    )}
  </View>
}

export default Main

