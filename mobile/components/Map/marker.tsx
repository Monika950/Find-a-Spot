import React from "react";
import { Marker } from "react-native-maps";

type MarkerPinProps = {
  positionMarker: {
    latitude: number;
    longitude: number;
  };
};

const MarkerPin: React.FC<MarkerPinProps> = ({
  positionMarker,
}) => {
  return (
    <Marker
      coordinate={positionMarker}
      onPress={() => {
        console.log("You clicked on the marker");
        console.log("Latitude:", positionMarker.latitude);
        console.log("Longitude:", positionMarker.longitude);
      }}

      image={require("../../assets/placeholder.png")} 
    />
  );
};

export default MarkerPin;
