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
  Alert,
} from "react-native";
import { Image } from "@/components/image";
import TriviaModal from "@/components/TriviaModal";
import MapView, { Marker, Circle } from "react-native-maps";
import { intervalToDuration } from "date-fns";
import { Plus, MoveDown, Info } from "lucide-react-native";

const { height, width } = Dimensions.get("window");

import { supabase } from "@/config/supabase";
import { Tables } from "@/components/primitives/label/supabase_types";

export type app_event = {
  title: string;
  description: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  radius?: number;
};

type EventWithQuestions = Tables<'current_location'> & {
  event_questions: Tables<"event_questions"> | null;
};
type Coordinates = { latitude: number; longitude: number };

const EventScreen = () => {
  const [events, setEvents] = useState<EventWithQuestions[]>([
    {
      name: "Trivia tournament @ Newcomb",
      event_questions: {
        description: "Trivia!",
        category: "trivia",
        correct_answer: "lkajsdf",
        created_at: "lkajsd",
        id: 1,
        name: "asdf",
        points: 150,
        question: "kajsdlkf",
        time_limit: 60,
        type: "jksaldf",
        wrong_answers: ["kjalskdf"],
      },
      time_of_event: "2025-02-18 18:00",
      coordinates: {
        latitude: 38.03567,
        longitude: -78.50684
      },
      category: "kjalksdjf",
      created_at: "sjlkdfj",
      event_id: 1,
      event_status:"in progress",
      id:"1",
      radius:20
    },
    {
      name: "another event.....",
      event_questions: {
        description: "Trivia!",
        category: "trivia",
        correct_answer: "lkajsdf",
        created_at: "lkajsd",
        id: 1,
        name: "asdf",
        points: 150,
        question: "kajsdlkf",
        time_limit: 60,
        type: "jksaldf",
        wrong_answers: ["kjalskdf"],
      },
      time_of_event: "2025-02-23 18:04:36+00",
      coordinates: {
        latitude: 38.03567,
        longitude: -78.50684
      },
      category: "kjalksdjf",
      created_at: "sjlkdfj",
      event_id: 1,
      event_status:"in progress",
      id:"1",
      radius:20
    },
  ]);
  const [countdown, setCountdown] = useState("00:00:00");
  const [scaleAnim] = useState(new Animated.Value(1));
  const [arrowAnim] = useState(new Animated.Value(0));

  const [triviaModalVisible, setTriviaModalVisible] = useState(false);
  const [completedTrivia, setCompletedTrivia] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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

  const handleCheckIn = () => {
    // if (getDistance(userLocation?.latitude, userLocation?.longitude, events[0].latitude, events[0].longitude) > 20) {
    //   Alert.alert("Too far!", "You must be within 20 meters of the event to check in.");
    //   return;
    // }
    if (!completedTrivia) {
      setTriviaModalVisible(true);
      setCompletedTrivia(true);
    }
    else {
      Alert.alert("Come back later 😃")
    }
  };

  // update events periodically
  
  useEffect(() => {
    const fetchEvents = async (): Promise<EventWithQuestions[]> => {
      const { data, error } = await supabase
        .from('current_location')
        .select(`
          *,
          event_questions: event_id (*)
        `);
    
      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      setEvents(data as EventWithQuestions[])
    
      return data as EventWithQuestions[];
    };

    //update events every 10 seconds
    console.log("fetching events")
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);

    return () => clearInterval(interval)
  }, [])

  //countdown logic
  useEffect(() => {
    if (events.length === 1) return;
    
    const eventTime = new Date(events[1].time_of_event || "2025-02-25 18:04:36+00").getTime(); // Convert event time to timestamp
    
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
              <Image className="h-[11rem] w-[20rem] mt-[3rem]" source={require("@/assets/wwlogo.png")}/>
			        <View className="flex-row items-center justify-center">
              <Text className="text-2xl font-bold text-gray-800">
                Upcoming Event ???
              </Text>
                <TouchableOpacity
                  onPress={() =>
                  Alert.alert("Upcoming Event", "The next event is revealed soon! Check in to the current one.")
                  }
                  className="ml-1 rounded-full"
                >
                  <Info size={20} color="black" />
                </TouchableOpacity>
				</View>
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
                <View className="w-[95%] h-64 mt-[2rem] rounded-lg overflow-hidden border-4 border-gray-200 shadow-lg">
                  <MapView
                    style={{ width: "100%", height: "100%" }}
                    initialRegion={{
                      latitude: (events[1]?.coordinates as Coordinates)?.latitude || 0,
                      longitude: (events[1]?.coordinates as Coordinates)?.longitude || 0,
                      latitudeDelta: 0.003,
                      longitudeDelta: 0.003,
                    }}
                  >
					<Marker
                      coordinate={{ // for current event
                        latitude: (events[0].coordinates as Coordinates).latitude || 0,
                        longitude: (events[0].coordinates as Coordinates).longitude || 0,
                      }}
                      title={events[0].name}
                      description={events[0].event_questions?.description}
                    />
                    <Circle
                      center={{
                        latitude: (events[0].coordinates as Coordinates).latitude || 0,
                        longitude: (events[0].coordinates as Coordinates).longitude || 0,
                      }}
                      radius={40}
                      strokeColor="rgba(112, 116, 255, 0.5)"
                      fillColor="rgba(0, 119, 255, 0.1)"
                    />

					
                    <Marker
                      coordinate={{ // for upcoming event
                        latitude: (events[1].coordinates as Coordinates).latitude || 0,
                        longitude: (events[1].coordinates as Coordinates).longitude || 0,
                      }}
                      title={events[1].name}
                      description={events[1].event_questions?.description}
                    />
                    <Circle
                      center={events[1].coordinates as Coordinates}
                      radius={40} // 500 meters radius
                      strokeColor="rgba(255, 0, 0, 0.5)"
                      fillColor="rgba(255, 0, 0, 0.2)"
                    />

                    {events.length > 2 &&
                      events.slice(1).map((event, index) => {
                        return (
                          <>
                          <Marker
                            coordinate={event.coordinates as Coordinates}
                            title={event.name}
                            description={event.event_questions?.description}
                          />
                          <Circle
                            center={event.coordinates as Coordinates}
                            radius={event.radius || 20}
                            strokeColor="rgba(31, 189, 0, 0.5)"
                            fillColor="rgba(31,189,0,0.2)"
                          />
                          </>
                        )
                      })}


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
					className="flex bg-blue-500/60 w-[95%] rounded-lg items-center justify-center mt-4"
					onPress={handleCheckIn}
					>
            <Text className="text-white text-center text-lg font-bold p-4">
              {!completedTrivia ? (
                <>
                  Check in to current event: {"\n"}
                  <Text className="text-yellow-300">{events[0].event_questions?.name}</Text>
                </>
              ) : (
                <Text className="text-black">You've already checked in to {events[0].event_questions?.name}!</Text>
              )}
            </Text>

				</TouchableOpacity>

				{/* Trivia Modal if Trivia */}
        <TriviaModal modalVisible={triviaModalVisible} setModalVisible={setTriviaModalVisible}/>
				</>
        )}

              {/* Scroll indicator with animation */}
              <View className="absolute bottom-[11rem] left-0 right-0 items-center">
                <Animated.View className="flex items-center" style={{ transform: [{ translateY: arrowAnim }] }}>
					<Text className="text-2xl mb-1 font-bold text-gray-800">Or all events</Text>
                  <MoveDown size={32} color="black" />
                </Animated.View>
              </View>
            </View>
          ) : (
            <View className="h-full px-5 pt-5" style={{ height }}>
              {/* Other Events Section */}
              <View className="flex-row items-center justify-between border-b border-gray-200 pb-2">
                <Text className="text-2xl font-bold text-gray-800">
                  All Events
                </Text>
                {/* <TouchableOpacity className="bg-blue-500 p-3 rounded-full items-center justify-center">
                  <Plus color="white" />
                </TouchableOpacity> */}
              </View>
              <FlatList
                data={events}
                keyExtractor={(event, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity className={`p-4 bg-gray-200 mb-2 rounded-lg mt-5`}>
                    <Text className="text-lg font-bold text-gray-800">
                      {item.event_questions?.question}
                    </Text>
                    <Text className="text-gray-500" numberOfLines={1}>
                      {item.event_questions?.description}
                    </Text>
					<Text numberOfLines={1}>
						{new Date(item.time_of_event || "").toLocaleString()}
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