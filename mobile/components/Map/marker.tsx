import React from "react";
import { MarkerF } from "@react-google-maps/api";


const pinIcon = {
    url: "../../public/placeholder.png",
    scaledSize: { width: 50, height: 40 },
};

type MarkerPinProps = {
    positionMarker: {
        lat: number,
        lng: number,
      },
      draggable?: boolean,
      onDragEnd?: (event: google.maps.MapMouseEvent) => void,
}

const MarkerPin: React.FC<MarkerPinProps> =({positionMarker})=>
{

    return (
            <MarkerF
                position={positionMarker}
                icon={pinIcon}
                onClick={(event) => {
                    console.log("you clicked on the marker");
                    console.log(event.latLng?.lat());
                    console.log(event.latLng?.lng());
                }}
            />
            
    );
}

export default MarkerPin;