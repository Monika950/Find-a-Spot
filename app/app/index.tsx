import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Modal, Pressable, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import { enableScreens } from "react-native-screens";
import { Polyline } from "react-native-maps";
import MarkerPin from "../components/Map/marker";
import useGeoLocation from "../components/Map/useGeo";
import MapView from "react-native-maps";

enableScreens();
import CarList from "../components/cars/CarList";

const defaultCenter = {
  latitude: 42.136097,
  longitude: 24.742168,
};

export default function Index() {
  const { user } = useAuth();
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup visibility state

  if (!user) {
    return <Redirect href="/auth" />;
  }

  const [location, setLocation] = useState({
    ...defaultCenter,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [scale, setScale] = useState(1);

  const onRegionChange = (region) => {
    const zoomLevel = Math.log(360 / region.latitudeDelta) / Math.LN2;
    setScale(1 / zoomLevel);
  };

  const userLocation = useGeoLocation();

  useEffect(() => {
    if (userLocation) {
      console.log(userLocation);
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, []);

  const lineCoordinates = [
    defaultCenter,
    { latitude: 42.6739551, longitude: 23.3305122 },
  ];
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SERVERURL}/segments/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ location }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setSegments(data);
        } else {
          console.log("FAIL");
        }
      } catch (error) {
        console.error("Segments fetch:", error);
      }
    };

    fetchData();
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Page</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          ...defaultCenter,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={location}
        onRegionChangeComplete={onRegionChange}
      >
        <MarkerPin positionMarker={location} scale={scale} />

        {segments.map((segment) => {
          const coordinates = [
            {
              longitude: segment.start[1],
              latitude: segment.start[0],
            },
            {
              longitude: segment.end[1],
              latitude: segment.end[0],
            },
          ];

          const freeRatio =
            (segment.freeParkingCapacity / segment.maxParkingCapacity) * 100;

          // Determine color based on the free ratio
          let color = "red"; // Default to red (overcrowded)
          console.log(segment.freeParkingCapacity, segment.maxParkingCapacity)
          if (freeRatio > 75) {
            color = "green"; // More than 75% free: green
          } else if (freeRatio > 25) {
            color = "yellow"; // 25% - 75% free: yellow
          }

          return (
            <Polyline
              coordinates={coordinates}
              strokeWidth={1} // Adjust the stroke width as needed
              strokeColor={color} // Dynamically set color
            />
          );
        })}
      </MapView>

      {/* Circular Popup Button */}
      <Pressable
        style={styles.popupButton}
        onPress={() => setIsPopupVisible(true)}
      >
        <Text style={styles.popupButtonText}>P</Text>
      </Pressable>

      {/* Popup Modal */}
      <Modal
        transparent={true}
        visible={isPopupVisible}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CarList callback={setIsPopupVisible} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: "90%",
  },
  popupButton: {
    position: "absolute",
    bottom: 20, // Positioned above the bottom edge
    right: 20, // Positioned on the right side of the screen
    backgroundColor: "#007bff",
    width: 60, // Circular button
    height: 60, // Circular button
    borderRadius: 30, // Make it a perfect circle
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Add shadow for better visibility
  },
  popupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24, // Large "P"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: 500,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#6200ee",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
