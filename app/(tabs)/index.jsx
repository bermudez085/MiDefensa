import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

dayjs.extend(relativeTime);
export default function IndexScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const router = useRouter();
  const mapRef = useRef(null);
  const [reports, setReports] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        try {
          const res = await fetch("http://192.168.0.56:5000/api/reports");
          const data = await res.json();
          setReports(data);
        } catch (err) {
          console.error("Failed to fetch reports:", err);
        }
      };

      fetchReports();
    }, [])
  );
  const recenterMap = () => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };


  useEffect(() => {
    let subscriber;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (loc) => {
          const coords = loc.coords;
          setLocation(coords);
          setRegion((prev) =>
            prev
              ? prev
              : {
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
          );
        }
      );
    })();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
        >
          {reports.map((report) => (
            <Marker
              key={report._id}
              title={`ICE Activity (${dayjs(report.timestamp).fromNow()})`}
              description={report.description}
              coordinate={{
                latitude: report.latitude,
                longitude: report.longitude,
              }}
              pinColor="red"
            />
          ))}
        </MapView>
      )}

      {/* Report Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          router.push("/report");
        }}
      >
        <Ionicons name="alert-circle" size={28} color="white" />
        <Text style={styles.fabText}>Report</Text>
      </TouchableOpacity>

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterBtn} onPress={recenterMap}>
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#ff3b30",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  recenterBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
