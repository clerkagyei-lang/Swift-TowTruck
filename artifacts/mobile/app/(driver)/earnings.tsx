import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useDriver } from "@/context/DriverContext";
import { useColors } from "@/hooks/useColors";

const TAB_BAR_HEIGHT = 80;

const MOCK_HISTORY = [
  { id: "1", type: "flatbed", amount: 250, customer: "Akosua B.", address: "Accra Mall → Tema", time: "2h ago", status: "paid" },
  { id: "2", type: "hook_chain", amount: 150, customer: "Kofi A.", address: "Osu → East Legon", time: "Yesterday", status: "paid" },
  { id: "3", type: "repair", amount: 100, customer: "Ama O.", address: "Circle Interchange", time: "Yesterday", status: "paid" },
  { id: "4", type: "flatbed", amount: 300, customer: "John D.", address: "Airport → Cantonments", time: "2 days ago", status: "paid" },
];

const TOW_ICONS: Record<string, string> = {
  flatbed: "truck-flatbed",
  hook_chain: "car-traction-control",
  repair: "wrench",
};

export default function EarningsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { earningsToday } = useDriver();

  const weekTotal = 980;
  const monthTotal = 4200;

  const styles = makeStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Earnings</Text>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="cash" size={22} color="rgba(255,255,255,0.8)" />
            <Text style={styles.summaryAmount}>GHS {(earningsToday + 0).toFixed(0)}</Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.secondary }]}>
            <MaterialCommunityIcons name="calendar-week" size={22} color="rgba(255,255,255,0.8)" />
            <Text style={styles.summaryAmount}>GHS {weekTotal}</Text>
            <Text style={styles.summaryLabel}>This Week</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.success }]}>
            <MaterialCommunityIcons name="calendar-month" size={22} color="rgba(255,255,255,0.8)" />
            <Text style={styles.summaryAmount}>GHS {monthTotal}</Text>
            <Text style={styles.summaryLabel}>This Month</Text>
          </View>
        </View>

        {/* Performance */}
        <View style={styles.perfCard}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.perfRow}>
            <View style={styles.perfItem}>
              <Ionicons name="star" size={20} color={colors.warning} />
              <Text style={styles.perfValue}>4.8</Text>
              <Text style={styles.perfLabel}>Rating</Text>
            </View>
            <View style={styles.perfDivider} />
            <View style={styles.perfItem}>
              <MaterialCommunityIcons name="truck-check" size={20} color={colors.primary} />
              <Text style={styles.perfValue}>142</Text>
              <Text style={styles.perfLabel}>Total Trips</Text>
            </View>
            <View style={styles.perfDivider} />
            <View style={styles.perfItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.perfValue}>98%</Text>
              <Text style={styles.perfLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Recent trips */}
        <Text style={styles.sectionTitle}>Recent Trips</Text>
        {MOCK_HISTORY.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripIconWrap}>
              <MaterialCommunityIcons
                name={TOW_ICONS[trip.type] as "truck-flatbed"}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripCustomer}>{trip.customer}</Text>
              <Text style={styles.tripAddress} numberOfLines={1}>{trip.address}</Text>
              <Text style={styles.tripTime}>{trip.time}</Text>
            </View>
            <View style={styles.tripRight}>
              <Text style={styles.tripAmount}>GHS {trip.amount}</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    screenTitle: {
      fontSize: 26,
      fontWeight: "800" as const,
      color: colors.text,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
    },
    summaryRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 16 },
    summaryCard: {
      flex: 1,
      borderRadius: 16,
      padding: 14,
      alignItems: "center",
      gap: 4,
    },
    summaryAmount: { fontSize: 16, fontWeight: "800" as const, color: "#FFFFFF" },
    summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
    perfCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    perfRow: { flexDirection: "row", alignItems: "center" },
    perfItem: { flex: 1, alignItems: "center", gap: 4 },
    perfDivider: { width: 1, height: 40, backgroundColor: colors.border },
    perfValue: { fontSize: 18, fontWeight: "700" as const, color: colors.text },
    perfLabel: { fontSize: 11, color: colors.mutedForeground },
    tripCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 10,
      borderRadius: 14,
      padding: 14,
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    tripIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    tripCustomer: { fontSize: 14, fontWeight: "600" as const, color: colors.text },
    tripAddress: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
    tripTime: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
    tripRight: { alignItems: "flex-end", gap: 4 },
    tripAmount: { fontSize: 16, fontWeight: "700" as const, color: colors.text },
    paidBadge: {
      backgroundColor: `${colors.success}20`,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    paidText: { fontSize: 11, color: colors.success, fontWeight: "600" as const },
  });
}
