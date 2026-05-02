import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Circle } from "react-native-maps";

interface Props {
  location: { latitude: number; longitude: number } | null;
  driverLocation: { latitude: number; longitude: number } | null;
  mapRef: React.RefObject<MapView>;
  colors: { primary: string; secondary: string };
  followUser?: boolean;
}

const ACCRA = { latitude: 5.6037, longitude: -0.187, latitudeDelta: 0.05, longitudeDelta: 0.05 };

export default function MapComponent({ location, driverLocation, mapRef, colors, followUser }: Props) {
  useEffect(() => {
    if (!mapRef.current) return;
    if (driverLocation && location) {
      const midLat = (driverLocation.latitude + location.latitude) / 2;
      const midLng = (driverLocation.longitude + location.longitude) / 2;
      const latDelta = Math.abs(driverLocation.latitude - location.latitude) * 2.5 + 0.01;
      const lngDelta = Math.abs(driverLocation.longitude - location.longitude) * 2.5 + 0.01;
      mapRef.current.animateToRegion({ latitude: midLat, longitude: midLng, latitudeDelta: latDelta, longitudeDelta: lngDelta }, 800);
    } else if (followUser && location) {
      mapRef.current.animateToRegion({ ...location, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 600);
    }
  }, [location, driverLocation, followUser]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={location ? { ...location, latitudeDelta: 0.018, longitudeDelta: 0.018 } : ACCRA}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass
      showsScale
      showsBuildings
      showsTraffic={false}
      userInterfaceStyle="light"
    >
      {location && (
        <Circle
          center={location}
          radius={80}
          strokeColor={`${colors.primary}40`}
          fillColor={`${colors.primary}18`}
          strokeWidth={2}
        />
      )}

      {driverLocation && (
        <Marker coordinate={driverLocation} title="Your Driver" anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles(colors).driverMarker}>
            <MaterialCommunityIcons name="truck-fast" size={20} color="#FFFFFF" />
          </View>
        </Marker>
      )}
    </MapView>
  );
}

const styles = (colors: { primary: string; secondary: string }) =>
  StyleSheet.create({
    driverMarker: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
  });
