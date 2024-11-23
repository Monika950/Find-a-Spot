import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

interface MapProps {
  children?: React.ReactNode;
  center: {
    latitude: number;
    longitude: number;
  };
  onMapLoad?: (loaded: boolean) => void;
  onPress?: (event: any) => void;
}

const Map: React.FC<MapProps> = ({ children, center, onMapLoad, onPress }) => {
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Simulate map load success as react-native-maps doesn't provide a direct "onLoad" prop
    setIsMapLoaded(true);
    if (onMapLoad) {
      onMapLoad(true);
    }
  }, [onMapLoad]);

  return (
    <View style={styles.container}>
      {isMapLoaded ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: 0.005, // Adjust zoom level
            longitudeDelta: 0.005, // Adjust zoom level
          }}
          onPress={onPress}
          onMapReady={() => {
            if (onMapLoad) onMapLoad(true);
          }}
        >
          {children}
          {/* Example Marker */}
          <Marker
            coordinate={{
              latitude: center.latitude,
              longitude: center.longitude,
            }}
            title="Center Location"
          />
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Loading map...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Map;
