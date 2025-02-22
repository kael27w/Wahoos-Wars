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

import { Animated, Easing } from "react-native";

const EventScreen = () => {
  const [events, setEvents] = useState<app_event[]>([]);
  const [countdown, setCountdown] = useState("00:00:00");
  const [modalVisible, setModalVisible] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<app_event | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  // Animated scale value for countdown
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Animated position value for MoveDown arrow
  const arrowAnim = useState(new Animated.Value(0))[0];

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

//   Countdown animation effect
  useEffect(() => {
    const animateCountdown = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 700,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => animateCountdown());
    };

    animateCountdown();
  }, []);

  // Arrow bounce animation effect
//   useEffect(() => {
//     const animateArrow = () => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(arrowAnim, {
//             toValue: 10, // Moves down by 10px
//             duration: 600,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(arrowAnim, {
//             toValue: 0, // Moves back up
//             duration: 600,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     };

//     animateArrow();
//   }, []);

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
                <Animated.Text
                  className="text-4xl font-black text-red-600"
                  style={{ transform: [{ scale: scaleAnim }] }}
                >
                  {countdown}
                </Animated.Text>
              </View>
              
              {/* Scroll indicator with animation */}
              <View className="absolute bottom-[20rem] left-0 right-0 items-center">
                <Animated.View style={{ transform: [{ translateY: arrowAnim }] }}>
                  <MoveDown size={32} color="black" />
                </Animated.View>
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
    </SafeAreaView>
  );
};

export default EventScreen;
