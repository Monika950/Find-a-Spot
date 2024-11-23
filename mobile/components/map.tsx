import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useState, useEffect } from 'react';

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const mapOptions = {
  zoom: 17,
  mapId: "MY_NEXTJS_MAP_ID",
  mapTypeControl: false,
  zoomControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  scrollwheel: true,
};

interface MapProps {
  children?: React.ReactNode;
  className?: string;
  center: {
    lat: number,
    lng: number,
  };
  onMapLoad?: (loaded: boolean) => void; 
  onClick?: (event: any) => void;
}

const Map: React.FC<MapProps> = ({ children, center, onMapLoad,onClick }) => {
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);


  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: "weekly",
  });

  useEffect(() => {
    if (isLoaded) {
      setIsMapLoaded(true);
      if (onMapLoad) {
        onMapLoad(true); 
      }
    } else {
      setIsMapLoaded(false);
      if (onMapLoad) {
        onMapLoad(false); 
      }
    }
  }, [isLoaded, onMapLoad]);

  return (
    <>
      {isMapLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          options={mapOptions}
          center={center}
          onClick={onClick}
        >
          {children}
        </GoogleMap>
      ) : (
        <div>Loading map...</div>
      )}
    </>
  );
}

export default Map;
