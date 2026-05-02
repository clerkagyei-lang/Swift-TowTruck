import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from "react-native-maps";

interface Props {
  driverLocation: { latitude: number; longitude: number } | null;
  requestLocation: { latitude: number; longitude: number } | null;
  mapRef: React.RefObject<MapView>;
  colors: { primary: string; secondary: string; success: string };
}

const ACCRA = { latitude: 5.6037, longitude: -0.187, latitudeDelta: 0.05, longitudeDelta: 0.05 };

export default function DriverMapComponent({ driverLocation, requestLocation, mapRef, colors }: Props) {
  useEffect(() => {
    if (!mapRef.current) return;
    if (driverLocation && requestLocation) {
      const midLat = (driverLocation.latitude + requestLocation.latitude) / 2;
      const midLng = (driverLocation.longitude + requestLocation.longitude) / 2;
      const latDelta = Math.abs(driverLocation.latitude - requestLocation.latitude) * 2.8 + 0.01;
      const lngDelta = Math.abs(driverLocation.longitude - requestLocation.longitude) * 2.8 + 0.01;
      mapRef.current.animateToRegion(
        { latitude: midLat, longitude: midLng, latitudeDelta: latDelta, longitudeDelta: lngDelta },
        700
      );
    } else if (driverLocation) {
      mapRef.current.animateToRegion({ ...driverLocation, latitudeDelta: 0.015, longitudeDelta: 0.015 }, 600);
    }
  }, [driverLocation, requestLocation]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={driverLocation ? { ...driverLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 } : ACCRA}
      showsUserLocation={false}
      showsMyLocationButton={false}
      showsCompass
      showsScale
      showsBuildings
      userInterfaceStyle="light"
    >
      {/* Driver marker */}
      {driverLocation && (
        <Marker coordinate={driverLocation} title="You" anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles(colors).driverMarker}>
            <MaterialCommunityIcons name="truck-fast" size={22} color="#FFFFFF" />
          </View>
        </Marker>
      )}

      {/* Request / pickup marker */}
      {requestLocation && (
        <Marker coordinate={requestLocation} title="Pickup" anchor={{ x: 0.5, y: 1 }}>
          <View style={styles(colors).pickupPin}>
            <MaterialCommunityIcons name="map-marker" size={36} color={colors.primary} />
          </View>
        </Marker>
      )}

      {/* Route line between driver and pickup */}
      {driverLocation && requestLocation && (
        <Polyline
          coordinates={[driverLocation, requestLocation]}
          strokeColor={colors.primary}
          strokeWidth={3}
          lineDashPattern={[8, 6]}
        />
      )}
    </MapView>
  );
}

const styles = (colors: { primary: string; secondary: string; success: string }) =>
  StyleSheet.create({
    driverMarker: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    pickupPin: {
      alignItems: "center",
      justifyContent: "center",
    },
  });
