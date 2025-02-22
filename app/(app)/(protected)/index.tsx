import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { intervalToDuration } from "date-fns";
import { Plus, MoveDown } from "lucide-react-native";

const { height, width } = Dimensions.get("window");

export type app_event = {
  title: string;
  description: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
};

const EventScreen = () => {
  const [events, setEvents] = useState<app_event[]>([
    {
      title: "Trivia tournament @ Newcomb",
      description: "Trivia!",
      time: "2025-02-18 18:00",
      location: "Newcomb",
      latitude: 38.03567,
      longitude: -78.50684,
    },
	{
		title: "???",
		description: "",
		time: "2025-02-25 18:00",
		location: "Rotunda",
		latitude: 38.03526,
		longitude: -78.50364,
	  },
  ]);
  const [countdown, setCountdown] = useState("00:00:00");
  const [scaleAnim] = useState(new Animated.Value(1));
  const [arrowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
	if (events.length === 1) return;
  
	const eventTime = new Date(events[1].time).getTime(); // Convert event time to timestamp
  
	const updateCountdown = () => {
	  const now = Date.now();
	  const timeDiff = eventTime - now; // Difference in milliseconds
  
	  if (timeDiff <= 0) {
		setCountdown("00d 00:00:00"); // If event time has passed
		return;
	  }
  
	  const duration = intervalToDuration({ start: now, end: eventTime });
  
	  const formattedCountdown = `${String(duration.days || 0).padStart(2, "0")}d ${String(duration.hours || 0).padStart(2, "0")}:${String(duration.minutes || 0).padStart(2, "0")}:${String(duration.seconds || 0).padStart(2, "0")}`;
  
	  setCountdown(formattedCountdown);
	};
  
	// Run immediately, then every second
	updateCountdown();
	const interval = setInterval(updateCountdown, 1000);
  
	return () => clearInterval(interval);
  }, [events]);  
  

  // Subtle countdown animation
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
      ]).start(animateCountdown);
    };
    animateCountdown();
  }, []);

  // Subtle bounce effect for arrow
//   useEffect(() => {
//     const animateArrow = () => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(arrowAnim, {
//             toValue: 5,
//             duration: 800,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(arrowAnim, {
//             toValue: 0,
//             duration: 800,
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
              {/* Countdown Section */}
              <Text className="text-2xl font-bold text-gray-800 mt-[10rem]">
                Upcoming Event ???
              </Text>
              <View className="w-full h-12 bg-white bg-opacity-80 rounded-full items-center justify-center">
                <Animated.Text
                  className="text-4xl font-black text-red-600"
                  style={{ transform: [{ scale: scaleAnim }] }}
                >
                  {countdown}
                </Animated.Text>
              </View>

              {/* Map Section Below Countdown */}
              {events.length > 1 && (
                <View className="w-[95%] h-64 mt-[2rem] rounded-lg overflow-hidden">
                  <MapView
                    style={{ width: "100%", height: "100%" }}
                    initialRegion={{
                      latitude: events[1].latitude,
                      longitude: events[1].longitude,
                      latitudeDelta: 0.003,
                      longitudeDelta: 0.003,
                    }}
                  >
					<Marker
                      coordinate={{ // for current event
                        latitude: events[0].latitude,
                        longitude: events[0].longitude,
                      }}
                      title={events[0].title}
                      description={events[0].description}
                    />
                    <Circle
                      center={{
                        latitude: events[0].latitude,
                        longitude: events[0].longitude,
                      }}
                      radius={20}
                      strokeColor="rgba(112, 116, 255, 0.5)"
                      fillColor="rgba(0, 119, 255, 0.5)"
                    />

					
                    <Marker
                      coordinate={{ // for upcoming event
                        latitude: events[1].latitude,
                        longitude: events[1].longitude,
                      }}
                      title={events[1].title}
                      description={events[1].description}
                    />
                    <Circle
                      center={{
                        latitude: events[1].latitude,
                        longitude: events[1].longitude,
                      }}
                      radius={20} // 500 meters radius
                      strokeColor="rgba(255, 0, 0, 0.5)"
                      fillColor="rgba(255, 0, 0, 0.2)"
                    />
                  </MapView>
                </View>
              )}

              {/* Scroll indicator with animation */}
              <View className="absolute bottom-[15rem] left-0 right-0 items-center">
                <Animated.View className="flex items-center" style={{ transform: [{ translateY: arrowAnim }] }}>
					<Text className="text-2xl mb-1 font-bold text-gray-800">Or other events</Text>
                  <MoveDown size={32} color="black" />
                </Animated.View>
              </View>
            </View>
          ) : (
            <View className="h-full px-5 pt-5" style={{ height }}>
              {/* Other Events Section */}
              <View className="flex-row items-center justify-between border-b border-gray-200 pb-2">
                <Text className="text-2xl font-bold text-gray-800">
                  Other Events
                </Text>
                <TouchableOpacity className="bg-blue-500 p-3 rounded-full items-center justify-center">
                  <Plus color="white" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={events}
                keyExtractor={(event, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity className={`p-4 bg-gray-200 mb-2 rounded-lg mt-5`}>
                    <Text className="text-lg font-bold text-gray-800">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500" numberOfLines={1}>
                      {item.description}
                    </Text>
					<Text numberOfLines={1}>
						{new Date(item.time).toLocaleString()}
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
