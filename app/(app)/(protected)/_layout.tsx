import { Tabs } from "expo-router";
import React from "react";
import { useFonts } from "expo-font";
import { Orbitron_400Regular } from "@expo-google-fonts/orbitron";
import { ActivityIndicator } from "react-native";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

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
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="Leaderboard" options={{ title: "Leaderboards" }} />
            <Tabs.Screen name="ProfileSettings" options={{ title: "Profile" }} />
        </Tabs>
    );
}
