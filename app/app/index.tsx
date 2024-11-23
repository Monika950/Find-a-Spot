// import { ThemedText, ThemedView } from "../components";
// import { useAuth } from "../contexts/AuthContext";
// import { Redirect } from "expo-router";
// import { enableScreens } from "react-native-screens";
// import { useState, useEffect } from "react";
// import { Text, View, StyleSheet } from "react-native";
// import MapView from "react-native-maps";
// import MarkerPin from "../components/Map/marker";
// import useGeoLocation from "../components/Map/useGeo";

// enableScreens();

// const defaultCenter = {
//   latitude: 42.136097,
//   longitude: 24.742168,
// };

// export default function Index() {
//   const { user } = useAuth();

//   if (!user) {
//     return <Redirect href="/auth" />;
//   }

//   const [location, setLocation] = useState({
//     ...defaultCenter,
//     latitudeDelta: 0.01,
//     longitudeDelta: 0.01,
//   });
//   const userLocation = useGeoLocation();
//   console.log(userLocation)

//   useEffect(() => {
//     if (userLocation.loaded && userLocation.coordinates) {
//         setLocation({
//           latitude: userLocation.coordinates.lat,
//           longitude: userLocation.coordinates.lng,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         });
//     }
//   }, [userLocation]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Map Page</Text>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           ...defaultCenter,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//         region={location}
//       >
        
//         <MarkerPin positionMarker={location} />

//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   map: {
//     width: "100%",
//     height: "90%",
//   },
// });



import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Modal, Pressable } from "react-native";
import MapView from "react-native-maps";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import MarkerPin from "../components/Map/marker";
import useGeoLocation from "../components/Map/useGeo";
import { enableScreens } from "react-native-screens";

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
  const userLocation = useGeoLocation();

  useEffect(() => {
    if (userLocation.loaded && userLocation.coordinates) {
      setLocation({
        latitude: userLocation.coordinates.lat,
        longitude: userLocation.coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Page</Text>

      {/* Map Component */}
      <MapView
        style={styles.map}
        initialRegion={{
          ...defaultCenter,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={location}
      >
        <MarkerPin positionMarker={location} />
      </MapView>

      {/* Circular Popup Button */}
      <Pressable style={styles.popupButton} onPress={() => setIsPopupVisible(true)}>
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
            <CarList callback = {setIsPopupVisible}/>
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
    height: 500
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
