import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  driverLocation: { latitude: number; longitude: number } | null;
  requestLocation: { latitude: number; longitude: number } | null;
  mapRef: React.RefObject<any>;
  colors: { primary: string; secondary: string; success: string };
}

export default function DriverMapComponent({ requestLocation, colors }: Props) {
  return (
    <View style={styles(colors).container}>
      <MaterialCommunityIcons name="truck-fast" size={64} color="rgba(52,73,94,0.2)" />
      <Text style={styles(colors).text}>Driver Map</Text>
      {requestLocation && (
        <View style={styles(colors).pickupBadge}>
          <MaterialCommunityIcons name="map-marker" size={14} color={colors.primary} />
          <Text style={styles(colors).pickupText}>Pickup location set</Text>
        </View>
      )}
    </View>
  );
}

const styles = (colors: { primary: string; secondary: string; success: string }) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#E2E8F0",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    text: { fontSize: 16, color: "#6C757D", fontWeight: "500" as const },
    pickupBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    pickupText: { fontSize: 13, fontWeight: "600" as const, color: colors.primary },
  });
