import React, { useState, useEffect } from "react";
import * as Location from "expo-location"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Alert
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { intervalToDuration } from "date-fns";
import { Plus, MoveDown } from "lucide-react-native";

const { height, width } = Dimensions.get("window");

import { Modal } from "react-native";

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

  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [canCheckIn, setCanCheckIn] = useState(false);

  // Haversine formula to calculate distance between two lat/lon points
  const getDistance = (lat1: number | undefined, lon1: number | undefined, lat2: number | undefined, lon2: number | undefined) => {
	if (!lat1 || !lon1 || !lat2 || !lon2) return 1000 //arbitrarily large value
    const R = 6371e3; // Earth's radius in meters
    const toRad = (angle: number) => (angle * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  //check to see if user can check in whenever location updates, too intensive to recalculate on every update though
//   useEffect(() => {
//     if (userLocation && events.length > 0) {
//       const distance = getDistance(
//         userLocation.latitude,
//         userLocation.longitude,
//         events[0].latitude,
//         events[0].longitude
//       );
//       setCanCheckIn(distance <= 20); // Allow check-in only if within 20 meters
//     }
//   }, [userLocation, events]);

  const handleCheckIn = () => {
    if (getDistance(userLocation?.latitude, userLocation?.longitude, events[0].latitude, events[0].longitude) > 20) {
      Alert.alert("Too far!", "You must be within 20 meters of the event to check in.");
      return;
    }
    setModalVisible(true);
  };

  //countdown logic
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);
  

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
				<>
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


					{userLocation && ( //user's current location
                        <Marker
                          coordinate={userLocation}
                          title="Your Location"
                          pinColor="blue"
                        />
                      )}
                  </MapView>
                </View>
				{/* Check-in Button */}
				<TouchableOpacity
					className="flex bg-blue-500 rounded-lg items-center justify-center mt-4"
					onPress={handleCheckIn}
					>
					<Text className="text-white text-center text-lg font-bold p-4">
						Check in to current event:{"\n"}{events[0].title}
					</Text>
				</TouchableOpacity>

				{/* Placeholder Modal */}
				<Modal visible={modalVisible} transparent animationType="slide">
					<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
						<View className="bg-white p-6 rounded-lg w-80 items-center">
						<Text className="text-lg font-bold mb-4">Check-in</Text>
						<Text>You have checked into {events[0].title}!</Text>
						<TouchableOpacity
							className="mt-4 bg-blue-500 px-4 py-2 rounded-full"
							onPress={() => setModalVisible(false)}
						>
							<Text className="text-white font-bold">OK</Text>
						</TouchableOpacity>
						</View>
					</View>
				</Modal>
				</>
              )}

              {/* Scroll indicator with animation */}
              <View className="absolute bottom-[11rem] left-0 right-0 items-center">
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