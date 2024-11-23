"use client";
import React, { useState, useEffect } from "react";
import Map from '../components/map';
import MarkerPin from '../components/marker';
import useGeoLocation from "../components/useGeo";

const center = { lat: 42.136097, lng: 24.742168 };


export default function Page() {
  
  const [location, setLocation] = useState(center);
  const userLocation = useGeoLocation();

  useEffect(() => {
    if (userLocation.loaded && userLocation.coordinates) {
      setLocation({
        lat: userLocation.coordinates.lat,
        lng: userLocation.coordinates.lng,
      });
    }
  }, [userLocation]);

    return(
    <>
    <h1>Map Page</h1>
    <Map
        center={userLocation.loaded ? location : center}>
          <MarkerPin
          positionMarker={location}
        />
        </Map>
    </> )
  }
  