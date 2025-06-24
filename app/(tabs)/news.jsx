import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* 👇 Soft Gray Header */}
      <View style={styles.fakeHeader}>
        <Text style={styles.fakeHeaderText}>Mi Defensa</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.subtitle}>
          Protección y preparación para familias inmigrantes
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest ICE Alerts</Text>
          <Text style={styles.cardContent}>
            🔴 ICE raid reported near Central Ave and 3rd St
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>News</Text>
          <Text style={styles.cardContent}>
            ICE activity rising in Texas cities this month
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal Tip of the Day</Text>
          <Text style={styles.cardContent}>
            If ICE is at your door, you can remain silent
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Community Announcements</Text>
          <Text style={styles.cardContent}>
            Meeting on immigration rights this Friday
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#d9d9d9",
  },
  fakeHeader: {
    backgroundColor: "#d9d9d9",
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  fakeHeaderText: {
    fontSize: RFValue(22),
    fontWeight: "bold",
  },
  container: {
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  subtitle: {
    fontSize: RFValue(16),
    color: "gray",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: RFValue(16),
    marginBottom: 4,
  },
  cardContent: {
    fontSize: RFValue(14),
  },
});
