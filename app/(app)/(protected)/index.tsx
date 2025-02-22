import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, Animated } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { Plus, X } from "lucide-react-native";
import { create } from "zustand";

// State management using Zustand
interface EventStore {
  events: app_event[];
  addEvent: (event: app_event) => void;
}

const useEventStore = create<EventStore>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
}));

export type app_event = {
  title: string;
  description: string;
  time: string;
  location: string;
};

const EventScreen = () => {
  const { events, addEvent } = useEventStore();
  const [countdown, setCountdown] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<app_event | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [scrollY] = useState(new Animated.Value(0));

  // Countdown logic (random event reveal)
  useEffect(() => {
    const futureDate = new Date(Date.now() + Math.random() * 86400000);
    const interval = setInterval(() => {
      setCountdown(formatDistanceToNow(futureDate, { addSuffix: true }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddEvent = () => {
    if (newTitle && newDescription) {
      addEvent({ title: newTitle, description: newDescription, time: "", location: "" });
      setNewTitle("");
      setNewDescription("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Top Section: Countdown */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Upcoming Events</Text>
        <Text style={{ fontSize: 18, color: "gray" }}>Next reveal {countdown}</Text>
      </View>
      
      {/* Bottom Section: Other Events */}
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        style={{ flex: 1 }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Other Events</Text>
        <FlatList
          data={events}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 15, backgroundColor: "#f0f0f0", marginBottom: 10, borderRadius: 10 }}
              onPress={() => { setSelectedEvent(item); setModalVisible(true); }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
              <Text numberOfLines={1} style={{ color: "gray" }}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      </Animated.ScrollView>
      
      {/* Add Event Button */}
      <TouchableOpacity
        style={{ position: "absolute", bottom: 20, right: 20, backgroundColor: "blue", padding: 15, borderRadius: 30 }}
        onPress={handleAddEvent}
      >
        <Plus/>
      </TouchableOpacity>
      
      {/* Event Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <X size={30}/>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>{selectedEvent?.title}</Text>
          <Text style={{ fontSize: 18 }}>{selectedEvent?.description}</Text>
        </View>
      </Modal>
      
      {/* Add Event Input Fields */}
      <View style={{ position: "absolute", bottom: 80, left: 20, right: 20, backgroundColor: "white", padding: 15, borderRadius: 10 }}>
        <TextInput placeholder="Event Title" value={newTitle} onChangeText={setNewTitle} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
        <TextInput placeholder="Event Description" value={newDescription} onChangeText={setNewDescription} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
        <Button title="Add Event" onPress={handleAddEvent} />
      </View>
    </View>
  );
};

export default EventScreen;
