import * as Device from "expo-device";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const deviceId = Device.osInternalBuildId || Device.deviceName;

export default function ReportScreen() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleSubmit = async () => {
    if (!location.trim()) {
      Alert.alert("Please enter a location.");
      return;
    }

    // ✅ NEW: Make sure GPS location was set
    if (!latitude || !longitude) {
      Alert.alert("Please use your location before submitting.");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.56:5000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: notes || "No additional notes",
          latitude,
          longitude,
          deviceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit report");
      }

      Alert.alert("✅ Thank you!", "Your report has been submitted.");
      setLocation("");
      setNotes("");
      router.back();
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Error", "Could not submit the report. Please try again.");
    }
  };

  const handleUseMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied to access location.");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;

    setLatitude(latitude);
    setLongitude(longitude);
    setLocation(
      `Current Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Report ICE Activity</Text>

      <Text style={styles.label}>📍 Location of Activity *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Central Ave & 3rd St"
        placeholderTextColor="#666"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.gpsBtn} onPress={handleUseMyLocation}>
        <Text style={styles.gpsText}>📍 Use My Location</Text>
      </TouchableOpacity>

      <Text style={styles.label}>📝 Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Any details you can share..."
        placeholderTextColor="#666"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(20),
    paddingTop: RFValue(50),
    backgroundColor: "#fff",
  },
  back: {
    color: "#007AFF",
    fontSize: RFValue(14),
    marginBottom: RFValue(10),
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: "700",
    marginBottom: RFValue(24),
  },
  label: {
    fontSize: RFValue(14),
    fontWeight: "500",
    marginBottom: RFValue(6),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: RFValue(12),
    fontSize: RFValue(14),
    marginBottom: RFValue(10),
  },
  notes: {
    height: RFValue(100),
    textAlignVertical: "top",
  },
  gpsBtn: {
    marginBottom: RFValue(16),
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(8),
    borderRadius: 6,
  },
  gpsText: {
    fontSize: RFValue(14),
    color: "#333",
  },
  submitBtn: {
    backgroundColor: "#ff3b30",
    paddingVertical: RFValue(14),
    borderRadius: 10,
    alignItems: "center",
    marginTop: RFValue(10),
  },
  submitText: {
    color: "white",
    fontWeight: "600",
    fontSize: RFValue(16),
  },
});
