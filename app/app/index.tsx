import { ThemedText, ThemedView } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import { enableScreens } from "react-native-screens";
import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import MarkerPin from "../components/Map/marker";
import useGeoLocation from "../components/Map/useGeo";

enableScreens();

const defaultCenter = {
  latitude: 42.136097,
  longitude: 24.742168,
};

export default function Index() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/auth" />;
  }

  const [location, setLocation] = useState({
    ...defaultCenter,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const userLocation = useGeoLocation();
  console.log(userLocation)

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
});
