import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useDriver } from "@/context/DriverContext";
import { useColors } from "@/hooks/useColors";
import DriverMapComponent from "@/components/DriverMapComponent";

const TOW_LABELS: Record<string, string> = {
  flatbed: "Flatbed",
  hook_chain: "Hook & Chain",
  repair: "Roadside Repair",
};

const TAB_BAR_HEIGHT = 80;

export default function DriverDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    isOnline,
    setOnline,
    driverLocation,
    incomingRequest,
    tripStatus,
    earningsToday,
    acceptRequest,
    declineRequest,
  } = useDriver();

  const mapRef = useRef<any>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (incomingRequest) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 300, duration: 250, useNativeDriver: true }).start();
    }
  }, [incomingRequest]);

  const handleToggleOnline = async (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setOnline(val);
  };

  const handleAccept = () => {
    if (!incomingRequest) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    acceptRequest(incomingRequest.id);
  };

  const handleDecline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    declineRequest();
  };

  const bottomPad = insets.bottom + TAB_BAR_HEIGHT;
  const styles = makeStyles(colors, bottomPad);

  return (
    <View style={styles.container}>
      <DriverMapComponent
        mapRef={mapRef}
        driverLocation={driverLocation}
        requestLocation={incomingRequest?.pickupLocation ?? null}
        colors={colors}
      />

      {/* Status bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 10) }]}>
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.mutedForeground }]} />
            <View>
              <Text style={styles.statusName}>{user?.name?.split(" ")[0]}</Text>
              <Text style={styles.statusLabel}>{isOnline ? "Online — accepting jobs" : "Offline"}</Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: colors.border, true: `${colors.primary}60` }}
            thumbColor={isOnline ? colors.primary : colors.mutedForeground}
          />
        </View>
      </View>

      {/* Earnings pill */}
      <View style={[styles.earningsPill, { top: insets.top + (Platform.OS === "web" ? 140 : 90) }]}>
        <MaterialCommunityIcons name="cash" size={14} color={colors.success} />
        <Text style={styles.earningsText}>GHS {earningsToday.toFixed(0)} today</Text>
      </View>

      {/* Offline overlay */}
      {!isOnline && (
        <View style={styles.offlineOverlay}>
          <View style={styles.offlineCard}>
            <MaterialCommunityIcons name="truck-fast" size={48} color={colors.mutedForeground} />
            <Text style={styles.offlineTitle}>You're Offline</Text>
            <Text style={styles.offlineText}>Toggle online above to start receiving tow requests.</Text>
          </View>
        </View>
      )}

      {/* Active trip indicator */}
      {tripStatus !== "idle" && (
        <View style={[styles.activeTripBanner, { bottom: bottomPad + 12 }]}>
          <Ionicons name="navigate" size={16} color="#FFFFFF" />
          <Text style={styles.activeTripText}>
            {tripStatus === "accepted" ? "Heading to pickup" : tripStatus === "in_progress" ? "Trip in progress" : "Trip completed!"}
          </Text>
        </View>
      )}

      {/* Incoming request sheet */}
      {incomingRequest && (
        <Animated.View style={[styles.requestSheet, { transform: [{ translateY: slideAnim }], bottom: bottomPad }]}>
          <View style={styles.handleBar} />
          <View style={styles.requestHeader}>
            <View style={[styles.requestTypeBadge]}>
              <MaterialCommunityIcons
                name={incomingRequest.towType === "flatbed" ? "truck-flatbed" : incomingRequest.towType === "hook_chain" ? "car-traction-control" : "wrench"}
                size={18}
                color={colors.primary}
              />
              <Text style={styles.requestTypeText}>{TOW_LABELS[incomingRequest.towType]}</Text>
            </View>
            <Text style={styles.requestAmount}>GHS {incomingRequest.estimatedAmount}</Text>
          </View>

          <View style={styles.requestDetail}>
            <Ionicons name="person-circle" size={16} color={colors.mutedForeground} />
            <Text style={styles.requestDetailText}>{incomingRequest.userName}</Text>
          </View>
          <View style={styles.requestDetail}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.requestDetailText} numberOfLines={2}>{incomingRequest.pickupAddress}</Text>
          </View>
          <View style={styles.requestDetail}>
            <Ionicons name="car" size={16} color={colors.mutedForeground} />
            <Text style={styles.requestDetailText}>{incomingRequest.vehicleDetails}</Text>
          </View>

          <View style={styles.requestActions}>
            <Pressable
              style={({ pressed }) => [styles.declineBtn, pressed && { opacity: 0.8 }]}
              onPress={handleDecline}
            >
              <Text style={styles.declineBtnText}>Decline</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.acceptBtn, pressed && { opacity: 0.88 }]}
              onPress={handleAccept}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.acceptBtnText}>Accept Job</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, bottomPad: number) {
  return StyleSheet.create({
    container: { flex: 1 },
    topBar: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 16 },
    statusCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "rgba(255,255,255,0.97)",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 5,
    },
    statusLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    statusDot: { width: 10, height: 10, borderRadius: 5 },
    statusName: { fontSize: 15, fontWeight: "700" as const, color: colors.text },
    statusLabel: { fontSize: 12, color: colors.mutedForeground, marginTop: 1 },
    earningsPill: {
      position: "absolute",
      right: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    earningsText: { fontSize: 13, fontWeight: "600" as const, color: colors.success },
    offlineOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(248,249,250,0.88)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    offlineCard: { alignItems: "center", gap: 10 },
    offlineTitle: { fontSize: 22, fontWeight: "700" as const, color: colors.text },
    offlineText: { fontSize: 14, color: colors.mutedForeground, textAlign: "center", lineHeight: 20 },
    activeTripBanner: {
      position: "absolute",
      left: 16,
      right: 16,
      backgroundColor: colors.primary,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 12,
    },
    activeTripText: { color: "#FFFFFF", fontWeight: "700" as const, fontSize: 14 },
    requestSheet: {
      position: "absolute",
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 16,
    },
    handleBar: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 16,
    },
    requestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    requestTypeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.accent,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    requestTypeText: { fontSize: 14, fontWeight: "700" as const, color: colors.primary },
    requestAmount: { fontSize: 22, fontWeight: "800" as const, color: colors.text },
    requestDetail: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 },
    requestDetailText: { fontSize: 14, color: colors.text, flex: 1, lineHeight: 20 },
    requestActions: { flexDirection: "row", gap: 10, marginTop: 16 },
    declineBtn: {
      flex: 1,
      height: 52,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    declineBtnText: { fontSize: 15, fontWeight: "600" as const, color: colors.mutedForeground },
    acceptBtn: {
      flex: 2,
      height: 52,
      borderRadius: 14,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    acceptBtnText: { fontSize: 15, fontWeight: "700" as const, color: "#FFFFFF" },
  });
}
