import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

type MarkerPinProps = {
  positionMarker: {
    latitude: number;
    longitude: number;
  };
  scale: number; 
};

const MarkerPin: React.FC<MarkerPinProps> = ({
positionMarker, scale }) => {

  const markerSize = Math.max(0, Math.min(2000, 500 * scale));

  return (
    <Marker 
    coordinate={positionMarker} 
    onPress={() => {
      console.log("You clicked on the marker");
      console.log("Latitude:", positionMarker.latitude);
      console.log("Longitude:", positionMarker.longitude);
    }}>
        <Image
          source={require("../../assets/placeholder.png")}
          style={{
            width: markerSize,
            height: markerSize,
            resizeMode: "contain",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
    </Marker>
  );
};

export default MarkerPin;
