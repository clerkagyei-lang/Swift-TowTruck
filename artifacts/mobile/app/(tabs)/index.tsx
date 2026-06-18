import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useAuth } from "@/context/AuthContext";
import { useTow } from "@/context/TowContext";
import { useColors } from "@/hooks/useColors";
import MapComponent from "@/components/MapComponent";

type TowType = "flatbed" | "hook_chain" | "repair";

const TOW_TYPES: { id: TowType; label: string; icon: string; desc: string; price: string }[] = [
  { id: "flatbed", label: "Flatbed", icon: "truck-flatbed", desc: "Best for luxury & AWD", price: "GHS 200–300" },
  { id: "hook_chain", label: "Hook & Chain", icon: "car-traction-control", desc: "Standard tow", price: "GHS 120–180" },
  { id: "repair", label: "Repair", icon: "wrench", desc: "On-site assistance", price: "GHS 80–150" },
];

const ACCRA = { latitude: 5.6037, longitude: -0.187 };
const TAB_BAR_HEIGHT = 80;

// PLACE YOUR GOOGLE MAPS API KEY HERE
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { towStatus, setTowStatus, setActiveRequest, driverLocation } = useTow();

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState("Locating you...");
  const [selectedTow, setSelectedTow] = useState<TowType>("flatbed");
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (towStatus === "accepted" || towStatus === "in_progress") {
      router.push("/active-request");
    }
  }, [towStatus]);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    (async () => {
      if (Platform.OS === "web") {
        setLocation(ACCRA);
        setAddress("Accra, Greater Accra Region, Ghana");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation(ACCRA);
        setAddress("Accra, Ghana");
        return;
      }

      const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = initial.coords;
      setLocation({ latitude, longitude });

      try {
        const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geo[0]) {
          const g = geo[0];
          setAddress([g.street, g.district, g.city].filter(Boolean).join(", ") || "Current Location");
        }
      } catch {
        setAddress("Current Location");
      }

      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 4000, distanceInterval: 8 },
        (pos) => {
          // Only automatically snap position if the user isn't trying to map lookups
          setLocation((prev) => prev ? prev : { latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        }
      );
    })();

    return () => { sub?.remove(); };
  }, []);

  const handleConfirmRequest = async () => {
    if (!user || !location) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSearching(true);
    setTowStatus("searching");

    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "localhost";
      const res = await fetch(`https://${domain}/api/tow-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userPhone: user.phone,
          towType: selectedTow,
          pickupLocation: location,
          pickupAddress: address,
          vehicleDetails: "My Vehicle",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveRequest(data);
        setTimeout(() => {
          setTowStatus("accepted");
          setIsSearching(false);
          router.push("/active-request");
        }, 4000);
      } else {
        setIsSearching(false);
        setTowStatus("idle");
      }
    } catch {
      setIsSearching(false);
      setTowStatus("idle");
    }
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setTowStatus("idle");
  };

  const bottomPad = insets.bottom + TAB_BAR_HEIGHT;
  const styles = makeStyles(colors, bottomPad);

  return (
    <View style={styles.container}>
      <MapComponent
        mapRef={mapRef}
        location={location}
        driverLocation={driverLocation}
        colors={colors}
        followUser={!driverLocation}
      />

      {/* Top bar with Google Address Search Autocomplete Built-in */}
      <View style={[styles.topBar, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 10) }]}>
        <View style={styles.greetingRow}>
          <View style={{ flex: 1, width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={styles.greeting}>Hi, {user?.name?.split(" ")[0]}</Text>
              <Pressable onPress={() => router.push("/help")} style={styles.helpBtn}>
                <Ionicons name="headset" size={18} color={colors.secondary} />
              </Pressable>
            </View>

            {/* Google Places Input Interface */}
            <View style={styles.searchWrapper}>
              <Ionicons name="search" size={18} color={colors.primary} style={styles.searchIcon} />
              <GooglePlacesAutocomplete
                placeholder={address}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  if (details?.geometry?.location) {
                    const selectedCoords = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    };
                    setLocation(selectedCoords);
                    setAddress(data.description);

                    // Animate the map frame automatically to show the searched location point
                    mapRef.current?.animateToRegion({
                      ...selectedCoords,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.015,
                    }, 1000);
                  }
                }}
                query={{
                  key: GOOGLE_MAPS_API_KEY,
                  language: 'en',
                  components: 'country:gh', // Focus search results within Ghana limits
                }}
                styles={{
                  textInputContainer: styles.autocompleteInputContainer,
                  textInput: styles.autocompleteTextInput,
                  listView: styles.autocompleteListView,
                  row: styles.autocompleteRow,
                  description: styles.autocompleteDescription,
                }}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Bottom panel */}
      <View style={styles.bottomPanel}>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.panelContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.handleBar} />
          <Text style={styles.panelTitle}>Select Tow Type</Text>

          <View style={styles.towTypes}>
            {TOW_TYPES.map((type) => (
              <Pressable
                key={type.id}
                style={[styles.towCard, selectedTow === type.id && styles.towCardActive]}
                onPress={() => { setSelectedTow(type.id); Haptics.selectionAsync(); }}
              >
                <MaterialCommunityIcons
                  name={type.icon as "truck-flatbed"}
                  size={26}
                  color={selectedTow === type.id ? colors.primary : colors.mutedForeground}
                />
                <Text style={[styles.towLabel, selectedTow === type.id && styles.towLabelActive]}>
                  {type.label}
                </Text>
                <Text style={styles.towPrice}>{type.price}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.confirmBtn,
              (isSearching || !location) && styles.confirmBtnDisabled,
              pressed && !isSearching && { opacity: 0.88 },
            ]}
            onPress={handleConfirmRequest}
            disabled={isSearching || !location}
          >
            {isSearching ? (
              <View style={styles.confirmBtnContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.confirmBtnText}>Finding Driver...</Text>
              </View>
            ) : (
              <View style
