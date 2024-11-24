import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for parking details and context
interface ParkingDetails {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  startTime: Date | null;
  plateNumber: string;
}

interface ParkingContextType {
  parkingDetails: ParkingDetails;
  setParkingDetails: (location: { latitude: number; longitude: number }, plateNumber, userToken) => Promise<void>;
  clearParkingDetails: (userToken) => Promise<void>;
}

// Props for the ParkingProvider
interface ParkingProviderProps {
  children: ReactNode;
}

// Create ParkingContext
const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: ParkingProviderProps) => {
  const [parkingDetails, setParkingDetailsState] = useState<ParkingDetails>({
    location: null,
    startTime: null,
    plateNumber: null,
  });
  // Load parking details from AsyncStorage on app load
  useEffect(() => {
    const loadParkingDetails = async () => {
      try {
        const storedDetails = await AsyncStorage.getItem("parkingDetails");
        if (storedDetails) {
          setParkingDetailsState(JSON.parse(storedDetails));
        }
      } catch (error) {
        console.error("Failed to load parking details from storage:", error);
      }
    };

    loadParkingDetails();
  }, []);

  // Set parking details (location and start time)
  const setParkingDetails = async (location: { latitude: number; longitude: number }, plateNumber, userToken) => {
    try {
      const newDetails: ParkingDetails = {
        location,
        startTime: new Date(),
        plateNumber
      };
      await AsyncStorage.setItem("parkingDetails", JSON.stringify(newDetails));
      setParkingDetailsState(newDetails);

      console.log(userToken);

      if (parkingDetails.startTime) {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVERURL}/cars/park`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            location: location,
            numberPlate: plateNumber
          }),
        });

        console.log(response);

        console.log(await response.json());

      }

    } catch (error) {
      console.error("Failed to save parking details to storage:", error);
    }
  };

  // Clear parking details
  const clearParkingDetails = async (userToken) => {
    try {
      await AsyncStorage.removeItem("parkingDetails");
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVERURL}/cars/park`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          numberPlate: parkingDetails.plateNumber
        }),
      });

      console.log(response);
      console.log(await response.json());
      setParkingDetailsState({ location: null, startTime: null, plateNumber: null });
    } catch (error) {
      console.error("Failed to clear parking details from storage:", error);
    }
  };

  // Provide parking context value
  const value: ParkingContextType = {
    parkingDetails,
    setParkingDetails,
    clearParkingDetails,
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

// Custom hook for accessing the ParkingContext
export const useParking = (): ParkingContextType => {
  const context = useContext(ParkingContext);

  if (!context) {
    throw new Error("useParking must be used within a ParkingProvider");
  }

  return context;
};
