import { useState, useEffect } from "react";
import Geolocation, { PositionError, GeoPosition } from "react-native-geolocation-service";
import { Platform, PermissionsAndroid } from "react-native";

interface LocationState {
  loaded: boolean;
  coordinates: { latitude: number; longitude: number } | null;
  error?: {
    code: number;
    message: string;
  };
}

const useGeoLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    loaded: false,
    coordinates: null,
  });

  const requestPermission = async () => {
    try {
      if (Platform.OS === "ios") {
        const status = await Geolocation.requestAuthorization("whenInUse");
        return status === "granted";
      } else if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return false;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  };

  const onSuccess = (position: GeoPosition) => {
    setLocation({
      loaded: true,
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
  };

  const onError = (error: PositionError) => {
    setLocation({
      loaded: true,
      coordinates: null,
      error: {
        code: error.code === 1 ? 1 : 2,  // 1 is PERMISSION_DENIED
        message: error.message,
      },
    });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const hasPermission = await requestPermission();

      if (hasPermission) {
        Geolocation.getCurrentPosition(
          onSuccess,
          onError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      } else {
        // Create a PositionError object when permission is denied
        const error: PositionError = {
          code: 1, // Denied error code
          message: "Location permission denied",
          PERMISSION_DENIED: true, // Explicitly add the permission denied property
        };
        onError(error);
      }
    };

    fetchLocation();
  }, []);

  return location;
};

export default useGeoLocation;
