import { useState, useEffect } from "react";
import Geolocation from "react-native-geolocation-service";

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

  const onSuccess = (position: GeolocationPosition) => {
    setLocation({
      loaded: true,
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
  };

  const onError = (error: GeolocationPositionError) => {
    setLocation({
      loaded: true,
      coordinates: null,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    Geolocation.requestAuthorization("whenInUse").then((status) => {
      if (status === "granted") {
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
        onError({
          code: 1, // Custom error code
          message: "Location permission denied",
        } as GeolocationPositionError);
      }
    });
  }, []);

  return location;
};

export default useGeoLocation;
