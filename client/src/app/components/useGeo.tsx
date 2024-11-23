import { useState, useEffect } from "react";

interface LocationState {
  loaded: boolean;
  coordinates: { lat: number; lng: number } | null;
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
        lat: position.coords.latitude,
        lng: position.coords.longitude,
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

    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      } as GeolocationPositionError); 
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeoLocation;
