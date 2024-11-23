import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export default function App() {
  const [location, setLocation] = useState<LocationState | null>(null);

  useEffect(() => {
    const getPermissionsAndTrackLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 15000,
          distanceInterval: 15, 
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation({
            coords: { latitude, longitude },
          });
          console.log("Updated Location:", { latitude, longitude }); 
        }
      );

      return () => {
        locationSubscription.remove();
      };
    };

    getPermissionsAndTrackLocation();
  }, []);

  useEffect(() => {
    if (location) {
      console.log("Current Location State:", location);
    }
  }, [location]);

  return location;
}
