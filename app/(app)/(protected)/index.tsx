import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button,
  Animated, SafeAreaView, Dimensions, StyleSheet, ScrollView
} from "react-native";
import { formatDistanceToNow } from "date-fns";
import { Plus, X } from "lucide-react-native";

const { height, width } = Dimensions.get("window"); // Get screen dimensions

export type app_event = {
  title: string;
  description: string;
  time: string;
  location: string;
};

const EventScreen = () => {
  const [events, setEvents] = useState<app_event[]>([]);
  const [countdown, setCountdown] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<app_event | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const futureDate = new Date(Date.now() + Math.random() * 86400000);
    const interval = setInterval(() => {
      setCountdown(formatDistanceToNow(futureDate, { addSuffix: true }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddEvent = () => {
    if (newTitle && newDescription) {
      setEvents([...events, { title: newTitle, description: newDescription, time: "", location: "" }]);
      setNewTitle("");
      setNewDescription("");
      setAddEventModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        snapToOffsets={[0, height * 0.9]} // Snaps to Upcoming Events
        decelerationRate="fast"
      >
        {/* Upcoming Events Section */}
        <View style={styles.upcomingSection}>
          <Text style={styles.upcomingTitle}>Upcoming Events</Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>

        {/* Other Events Section */}
        <View style={styles.otherEventsContainer}>
          <Text style={styles.otherEventsTitle}>Other Events</Text>

          {/* Add Event Button Beside Header */}
          <TouchableOpacity style={styles.addButton} onPress={() => setAddEventModal(true)}>
            <Plus color="white" />
          </TouchableOpacity>
        </View>

        {/* List of Events */}
        <FlatList
          data={events}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard} onPress={() => { setSelectedEvent(item); setModalVisible(true); }}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text numberOfLines={1} style={styles.eventDescription}>{item.description}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noEvents}>No events yet. Add one!</Text>}
        />
      </Animated.ScrollView>

      {/* Event Details Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <X size={28} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.modalDescription}>{selectedEvent?.description}</Text>
          </View>
        </View>
      </Modal>

      {/* Add Event Modal */}
      <Modal visible={addEventModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setAddEventModal(false)} style={styles.closeButton}>
              <X size={28} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TextInput placeholder="Event Title" value={newTitle} onChangeText={setNewTitle} style={styles.input} />
            <TextInput placeholder="Event Description" value={newDescription} onChangeText={setNewDescription} style={styles.input} multiline />
            <Button title="Add Event" onPress={handleAddEvent} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  upcomingSection: {
    height: height * 0.9,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: height * 0.1,
    backgroundColor: "#f8f8f8",
  },
  upcomingTitle: { fontSize: 28, fontWeight: "bold", color: "#333" },
  countdown: { fontSize: 40, fontWeight: "900", color: "#e63946", marginTop: 10 },

  otherEventsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  otherEventsTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },

  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  eventCard: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  eventDescription: { color: "gray" },
  noEvents: { textAlign: "center", padding: 20, fontSize: 16, color: "#888" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  modalDescription: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  closeButton: { position: "absolute", top: 10, right: 10 },

  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
});

export default EventScreen;
