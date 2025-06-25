import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

const deviceId = Device.osInternalBuildId || Device.deviceName;

export default function ReportScreen() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [preview, setPreview] = useState("");
  const [lastGeocodeResult, setLastGeocodeResult] = useState(null);

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const formatted = data.results[0].formatted_address;

        return {
          latitude: location.lat,
          longitude: location.lng,
          displayName: formatted,
        };
      } else {
        return null;
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (location.trim().length === 0) {
        setPreview("");
        return;
      }

      const result = await geocodeAddress(location.trim());

      if (result) {
        setPreview(`Found: ${result.displayName}`);
        setLastGeocodeResult(result);
      } else {
        setPreview("Couldn’t find that location.");
        setLastGeocodeResult(null);
      }
    }, 500); // wait 500ms before running

    return () => clearTimeout(delayDebounce);
  }, [location]);

  const handleSubmit = async () => {
    if (!location.trim()) {
      Alert.alert("Please enter a location.");
      return;
    }

    let lat = latitude;
    let lon = longitude;

    if (!lat || !lon) {
      if (!lastGeocodeResult) {
        Alert.alert("Couldn't find the location you typed.");
        return;
      }

      lat = lastGeocodeResult.latitude;
      lon = lastGeocodeResult.longitude;
    }

    try {
      const response = await fetch("http://192.168.0.56:5000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: notes || "No additional notes",
          latitude: lat,
          longitude: lon,
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
      setLatitude(null);
      setLongitude(null);
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

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setLocation(address); // sets full address into the input field
        setPreview("Using your current location.");
      } else {
        setPreview("Could not find your address.");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      Alert.alert("Failed to get your address. Try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Report ICE Activity</Text>

          <Text style={styles.label}>📍 Location of Activity *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 123 Main St, Newark NJ"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />
          {preview ? <Text style={styles.preview}>{preview}</Text> : null}

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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  preview: {
    fontSize: RFValue(13),
    color: "#555",
    marginBottom: RFValue(10),
  },
});
