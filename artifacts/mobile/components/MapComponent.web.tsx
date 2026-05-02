import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  location: { latitude: number; longitude: number } | null;
  driverLocation: { latitude: number; longitude: number } | null;
  mapRef: React.RefObject<any>;
  colors: { primary: string; secondary: string };
  followUser?: boolean;
}

export default function MapComponent({ driverLocation, colors }: Props) {
  return (
    <View style={styles(colors).container}>
      <Ionicons name="map" size={64} color="rgba(255,107,0,0.2)" />
      <Text style={styles(colors).text}>Accra, Greater Accra, Ghana</Text>
      {driverLocation && (
        <View style={styles(colors).driverBadge}>
          <Text style={styles(colors).driverBadgeText}>Driver nearby</Text>
        </View>
      )}
    </View>
  );
}

const styles = (colors: { primary: string; secondary: string }) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#E8EFF8",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    text: { fontSize: 16, color: "#6C757D", fontWeight: "500" as const },
    driverBadge: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 6,
      marginTop: 8,
    },
    driverBadgeText: { color: "#FFFFFF", fontWeight: "600" as const, fontSize: 13 },
  });
