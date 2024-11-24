import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Modal, Pressable,Image, Alert } from "react-native";
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
        console.log(`${process.env.EXPO_PUBLIC_SERVERURL}/segments/`);
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
      {/* <Text style={styles.title}>Find a Spot</Text> */}
      <Image
  source={require("../assets/logo.png")}
  style={styles.logo}
/>

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
          const coordinates= [...segment.switched_coordinates];
          

          //console.log(segment.switched_coordinates);
          const freeRatio =(segment.freeParkingCapacity / segment.max_capacity) * 100;

          let color = "red"; // Default to red (overcrowded)
        //   console.log(segment.freeParkingCapacity, segment.max_capacity)
        //   console.log(freeRatio)
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
            <CarList callback = {setIsPopupVisible} location = {location}/>
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
      margin:0
    },
    map: {
      width: "100%",
      height: "100%",
    },
    logo: {
      width: 60,
      height: 90, 
      position: "absolute",
      top: 40, 
      left: 20,
      zIndex: 10,
      elevation: 5,
    },
    popupButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "#007bff",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
    },
    popupButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 24,
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
  });
  