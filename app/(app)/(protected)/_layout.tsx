import { Tabs } from "expo-router";
import React from "react";
import { useFonts } from "expo-font";
import { Orbitron_400Regular } from "@expo-google-fonts/orbitron";
import { ActivityIndicator } from "react-native";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

import {Home, Settings, User } from "lucide-react-native"

export default function ProtectedLayout() {
    const { colorScheme } = useColorScheme();

    // Load the Orbitron font
    const [fontsLoaded] = useFonts({
        Orbitron: Orbitron_400Regular,
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#fff" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colorScheme === "dark"
                        ? colors.dark.background
                        : colors.light.background,
                },
                tabBarActiveTintColor: colorScheme === "dark"
                    ? colors.dark.foreground
                    : colors.light.foreground,
                tabBarShowLabel: false,
                tabBarLabelStyle: {
                    fontFamily: "Orbitron",  // 👈 Apply Orbitron font here
                    fontSize: 14,
                },
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => (
				<Home color={color} size={size} />
			) }} />
			<Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color, size }) => (
						<Settings color={color} size={size} />
					) }} />
            <Tabs.Screen name="ProfileSettings" options={{ title: "Profile", tabBarIcon: ({ color, size }) => (
                    <User color={color} size={size}/>
     ) }} />
        </Tabs>
    );
}
