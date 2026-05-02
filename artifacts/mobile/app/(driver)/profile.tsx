import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const TAB_BAR_HEIGHT = 80;

export default function DriverProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();

  const styles = makeStyles(colors);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout();
      return;
    }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.driverBadge}>
            <MaterialCommunityIcons name="truck-fast" size={14} color={colors.primary} />
            <Text style={styles.driverBadgeText}>Swift Tow Driver</Text>
          </View>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={22} color={colors.warning} />
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="truck-check" size={22} color={colors.primary} />
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Trips Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="cash" size={22} color={colors.success} />
            <Text style={styles.statValue}>GHS 4.2k</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>

        {/* Vehicle info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="truck-flatbed" size={18} color={colors.secondary} />
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>Flatbed Tow Truck</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="car" size={18} color={colors.secondary} />
            <Text style={styles.infoLabel}>Plate</Text>
            <Text style={styles.infoValue}>GR 4421-22</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color={colors.secondary} />
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {[
            { icon: "headset-outline", label: "Help & Support", action: () => router.push("/help") },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: colors.muted }]}
              onPress={item.action}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as "headset-outline"} size={18} color={colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.8 }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    hero: { alignItems: "center", paddingVertical: 28, paddingHorizontal: 20 },
    avatarCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    avatarLetter: { fontSize: 36, fontWeight: "700" as const, color: "#FFFFFF" },
    name: { fontSize: 22, fontWeight: "700" as const, color: colors.text, marginBottom: 6 },
    driverBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 5,
      marginBottom: 8,
    },
    driverBadgeText: { fontSize: 13, fontWeight: "600" as const, color: colors.primary },
    email: { fontSize: 13, color: colors.mutedForeground },
    statsCard: {
      flexDirection: "row",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    statItem: { flex: 1, alignItems: "center", gap: 4 },
    statDivider: { width: 1, backgroundColor: colors.border },
    statValue: { fontSize: 15, fontWeight: "700" as const, color: colors.text },
    statLabel: { fontSize: 11, color: colors.mutedForeground },
    sectionCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    sectionTitle: { fontSize: 15, fontWeight: "700" as const, color: colors.text, marginBottom: 4 },
    infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    infoLabel: { fontSize: 13, color: colors.mutedForeground, width: 48 },
    infoValue: { fontSize: 14, color: colors.text, fontWeight: "500" as const },
    menuCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: 16,
      marginBottom: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    menuIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    menuLabel: { fontSize: 15, fontWeight: "500" as const, color: colors.text },
    signOutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginHorizontal: 16,
      padding: 16,
      backgroundColor: "#FEF2F2",
      borderRadius: 14,
    },
    signOutText: { fontSize: 15, fontWeight: "600" as const, color: colors.destructive },
  });
}
