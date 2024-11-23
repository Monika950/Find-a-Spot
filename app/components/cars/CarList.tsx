import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CarForm from "./CarForm";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addCar = (car) => {
    setCars([...cars, { id: Date.now().toString(), ...car }]);
    setShowForm(false);
  };

  const selectCar = (carId) => {
    alert(`Selected car with ID: ${carId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cars</Text>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.carItem}
            onPress={() => selectCar(item.id)}
          >
            <Text style={styles.carText}>
              {item.name} ({item.number})
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noCarsText}>No cars added yet.</Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
        <Text style={styles.addButtonText}>Add Car</Text>
      </TouchableOpacity>

      {showForm && (
        <CarForm onSubmit={addCar} onCancel={() => setShowForm(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  noCarsText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 16,
    color: "#888",
  },
  carItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  carText: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
