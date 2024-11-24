import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import CarForm from "./CarForm";
import SendSMS from "../../hooks/SendSms";
import { useAuth } from "../../contexts/AuthContext";
import { useParking } from "../../contexts/ParkingContext";
import { ZoneNumbers } from "../../constants/ZoneNumbers";

export default function CarList({ callback, location }) {
  const { user,logout } = useAuth();
  const { parkingDetails, setParkingDetails } = useParking();

  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null); // Track the selected car
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility
  const [zoneType, setZoneType] = useState("");


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    async function getCarsData() {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVERURL}/cars/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCars(
          data.map((car) => ({
            id: car._id,
            name: car.description,
            number: car.numberPlate,
          }))
        );
      }
    }

    getCarsData();
  }, []);

  const addCar = async (car) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVERURL}/cars/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          description: car.name,
          numberPlate: car.number,
        }),
      });

      const data = await response.json();
      setCars([...cars, { id: data._id, ...car }]);
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while trying to add the car.");
    }

    setShowForm(false);
  };

  const selectCar = (car) => {
    setSelectedCar(car); // Set the selected car
    setZoneType("Green");
    setIsModalVisible(true); // Show the modal
  };

  const handleConfirm = (plateNumber) => {
    const zoneNumber = zoneType === "Green" ? ZoneNumbers.greenZoneNumber : ZoneNumbers.blueZoneNumber;
    SendSMS(plateNumber, "0897878058", async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVERURL}/cars/park`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            plateNumber,
            location,
          }),
        });

        const data = await response.json();
        setIsModalVisible(false);
        setParkingDetails(location, plateNumber, user.token);

      } catch (error) {
        Alert.alert("Error", "An error occurred when trying to send SMS.");
      }
    });
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cars</Text>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.carItem} onPress={() => selectCar(item)}>
            <Text style={styles.carText}>
              {item.name} ({item.number})
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noCarsText}>No cars added yet.</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
        <Text style={styles.addButtonText}>Add Car</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => callback(false)} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>

      {showForm && <CarForm onSubmit={addCar} onCancel={() => setShowForm(false)} />}

      {/* Modal for car selection */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.popupText}>
              Are you sure you want to send a SMS for {zoneType} zone: {selectedCar?.name} ({selectedCar?.number})?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButtonConfirm}
                onPress={() => handleConfirm(selectedCar.number)}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </Pressable>
              <Pressable style={styles.modalButtonClose} onPress={handleClose}>
                <Text style={styles.modalButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  timerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  stopButton: {
    marginTop: 10,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  carItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
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
    margin: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 12,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButtonConfirm: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    margin: 5,
    flex: 1,
    alignItems: "center",
  },
  modalButtonClose: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    margin: 5,
    flex: 1,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 10,
  },
  noCarsText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 16,
    color: "#888",
  },
});
