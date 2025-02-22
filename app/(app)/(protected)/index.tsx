import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Animated,
  SafeAreaView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { intervalToDuration } from "date-fns";
import { Plus, X, MoveDown } from "lucide-react-native";

const { height, width } = Dimensions.get("window"); // Get screen dimensions

export type app_event = {
  title: string;
  description: string;
  time: string;
  location: string;
};

const EventScreen = () => {
  const [events, setEvents] = useState<app_event[]>([]);
  const [countdown, setCountdown] = useState("00:00:00");
  const [modalVisible, setModalVisible] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<app_event | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const scrollY = new Animated.Value(0);

  const ripplePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const futureDate = new Date(Date.now() + 3600000); // 1 hour from now for testing
    const interval = setInterval(() => {
      const now = Date.now();
      const duration = intervalToDuration({ start: now, end: futureDate });

      // Ensure all properties are defined
      const hours = duration.hours || 0;
      const minutes = duration.minutes || 0;
      const seconds = duration.seconds || 0;

      const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setCountdown(formattedCountdown);

      // Ripple effect animation
      Animated.loop(
        Animated.timing(ripplePosition, {
          toValue: width,
          duration: 3000,
          useNativeDriver: false,
        })
      ).start();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddEvent = () => {
    if (newTitle && newDescription) {
      setEvents([
        ...events,
        { title: newTitle, description: newDescription, time: "", location: "" },
      ]);
      setNewTitle("");
      setNewDescription("");
      setAddEventModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        data={[{ key: "upcoming" }, { key: "other" }]}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        snapToOffsets={[0, height]} // Snaps between sections
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        pagingEnabled
        renderItem={({ item }) =>
          item.key === "upcoming" ? (
            <View style={styles.upcomingSection} className="mt-[15rem]">
              <Text style={styles.upcomingTitle}>Upcoming Event</Text>
              <Animated.View
                style={[
                  styles.countdownContainer,
                  {
                    transform: [{ translateX: ripplePosition }],
                  },
                ]}
              >
                <Text style={styles.countdown}>{countdown}</Text>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.otherEventsContainer} className="mt-[-10rem]">
              <View style={styles.otherEventsHeader}>
                <Text style={styles.otherEventsTitle}>Other Events</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setAddEventModal(true)}
                >
                  <Plus color="white" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={events}
                keyExtractor={(event, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.eventCard}
                    onPress={() => {
                      setSelectedEvent(item);
                      setModalVisible(true);
                    }}
                    className="mt-5"
                  >
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.eventDescription}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.noEvents}>No events yet. Add one!</Text>
                }
              />
            </View>
          )
        }
      />

      {/* Event Details Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={28} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.modalDescription}>
              {selectedEvent?.description}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Add Event Modal */}
      <Modal visible={addEventModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setAddEventModal(false)}
              style={styles.closeButton}
            >
              <X size={28} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TextInput
              placeholder="Event Title"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Event Description"
              value={newDescription}
              onChangeText={setNewDescription}
              style={styles.input}
              multiline
            />
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
    height,
    alignItems: "center",
  },
  upcomingTitle: { fontSize: 28, fontWeight: "bold", color: "#333" },
  countdownContainer: {
    width: 200,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  countdown: {
    fontSize: 40,
    fontWeight: "900",
    color: "#e63946",
  },

  otherEventsContainer: {
    height,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  otherEventsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
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