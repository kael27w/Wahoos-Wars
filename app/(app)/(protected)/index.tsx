import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  SafeAreaView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { intervalToDuration } from "date-fns";
import { Plus, X, MoveDown } from "lucide-react-native";

const { height, width } = Dimensions.get("window");

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

  useEffect(() => {
    const futureDate = new Date(Date.now() + 3600000);
    const interval = setInterval(() => {
      const now = Date.now();
      const duration = intervalToDuration({ start: now, end: futureDate });

      const hours = duration.hours || 0;
      const minutes = duration.minutes || 0;
      const seconds = duration.seconds || 0;

      const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setCountdown(formattedCountdown);
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
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={[{ key: "upcoming" }, { key: "other" }]}
        keyExtractor={(item) => item.key}
        snapToOffsets={[0, height]}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        pagingEnabled
        renderItem={({ item }) =>
          item.key === "upcoming" ? (
            <View className="h-full items-center" style={{ height }}>
              <Text className="text-2xl font-bold text-gray-800 mt-60">
                Upcoming Event
              </Text>
              <View
                className="w-56 h-12 bg-white bg-opacity-80 rounded-full items-center justify-center overflow-hidden"
                style={{ width: 200, height: 50 }}
              >
                <Text className="text-4xl font-black text-red-600">
                  {countdown}
                </Text>
              </View>
              
              {/* Scroll indicator */}
              <View className="absolute bottom-[20rem] left-0 right-0 items-center">
                <View className="self-center">
                  <MoveDown size={32} color="black"/>
                </View>
              </View>
            </View>
          ) : (
            <View className="h-full px-5 pt-5" style={{ height }}>
              <View className="flex-row items-center justify-between border-b border-gray-200 pb-2">
                <Text className="text-2xl font-bold text-gray-800">
                  Other Events
                </Text>
                <TouchableOpacity
                  className="bg-blue-500 p-3 rounded-full items-center justify-center"
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
                    className="p-4 bg-gray-200 mb-2 rounded-lg mt-5"
                    onPress={() => {
                      setSelectedEvent(item);
                      setModalVisible(true);
                    }}
                  >
                    <Text className="text-lg font-bold text-gray-800">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500" numberOfLines={1}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text className="text-center p-5 text-gray-400">
                    No events yet. Add one!
                  </Text>
                }
              />
            </View>
          )
        }
      />

      {/* Event Details Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="w-4/5 bg-white p-5 rounded-lg items-center shadow-lg">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-4 right-4"
            >
              <X size={28} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold mb-4">
              {selectedEvent?.title}
            </Text>
            <Text className="text-base text-center mb-6">
              {selectedEvent?.description}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Add Event Modal */}
      <Modal visible={addEventModal} animationType="slide" transparent>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="w-4/5 bg-white p-5 rounded-lg items-center shadow-lg">
            <TouchableOpacity
              onPress={() => setAddEventModal(false)}
              className="absolute top-4 right-4"
            >
              <X size={28} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold mb-4">Add New Event</Text>
            <TextInput
              placeholder="Event Title"
              value={newTitle}
              onChangeText={setNewTitle}
              className="w-full border-b border-gray-200 mb-4 py-2 text-base"
            />
            <TextInput
              placeholder="Event Description"
              value={newDescription}
              onChangeText={setNewDescription}
              className="w-full border-b border-gray-200 mb-4 py-2 text-base"
              multiline
            />
            <Button title="Add Event" onPress={handleAddEvent} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EventScreen;