import React, { useState, useMemo } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import { H1, Muted } from "@/components/ui/typography";
import { SelectList } from "react-native-dropdown-select-list"; 
import { useNavigation } from "expo-router";

// Sample Badge Data
const badgeData = [
  { playerName: "Player 1", badge: "Gold Math", earned: true },
  { playerName: "Player 2", badge: "Silver History", earned: true },
  { playerName: "Player 3", badge: "Bronze General Knowledge", earned: true },
];

// Sample User Data
const userData = {
  playerName: "Player 3", // User's player name; this should be set according to their position
  score: 150, // User's score
};

// Fixed player data with names and scores (can be dynamic from a database)
const playerData = [
  { name: "Player 1", score: 120 },
  { name: "Player 2", score: 150 },
  { name: "Player 3", score: 90 },
  { name: "Player 4", score: 0 },
  { name: "Player 5", score: 0 },
  { name: "Player 6", score: 0 },
  { name: "Player 7", score: 0 },
  { name: "Player 8", score: 0 },
  { name: "Player 9", score: 0 },
  { name: "Player 10", score: 0 },
  { name: "Player 11", score: 0 },
  { name: "Player 12", score: 0 },
  { name: "Player 13", score: 0 },
  { name: "Player 14", score: 0 },
  { name: "Player 15", score: 0 },
  { name: "Player 16", score: 0 },
  { name: "Player 17", score: 0 },
  { name: "Player 18", score: 0 },
  { name: "Player 19", score: 0 },
  { name: "Player 20", score: 0 },
];

const leaderboardTypes = [
  { key: "history", value: "History" },
  { key: "math", value: "Math" },
  { key: "grand total", value: "Grand Total" },
];

export default function Leaderboard() {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState("history");

  // Calculate leaderboard ranks based on scores
  const leaderboardData = useMemo(() => {
    // Clone and sort player data based on scores
    const sortedPlayers = [...playerData].sort((a, b) => b.score - a.score);
    return sortedPlayers.map((player, index) => ({
      rank: index + 1, // Rank starts from 1
      name: player.name,
      score: player.score,
    }));
  }, []);

  // Find user data rank if applicable
  const userRankIndex = leaderboardData.findIndex(player => player.score <= userData.score);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : leaderboardData.length + 1;

  // Include user data if they have a score that qualifies for the leaderboard
  const adjustedLeaderboardData = userData.score > 0 ? 
    [...leaderboardData, { rank: userRank, name: userData.playerName, score: userData.score }] 
    : leaderboardData;

  // Ensure to show only top 20
  const filteredData = useMemo(() => {
    return adjustedLeaderboardData.slice(0, 20); // Top 20 only
  }, [adjustedLeaderboardData]);

  // Find user name based on rank
  const userRankPlayer = leaderboardData[userRank - 1]?.name || userData.playerName;

  return (
    <ScrollView style={styles.container}>
      <H1 style={styles.header}>🏆 Leaderboard</H1>
      <Muted style={styles.subHeader}>Here are the top scores:</Muted>

      <SelectList
        setSelected={setSelectedType}
        data={leaderboardTypes}
        save="key"
        placeholder="Select Leaderboard Type"
        dropdownStyles={styles.dropdown}
        dropdownTextStyles={styles.dropdownText} 
      />

      {/* Player Info Box */}
      <View style={styles.userInfoBox}>
        <Text style={styles.userRank}>Rank: {userRank}</Text>
        <Text style={styles.userName}>{userRankPlayer}</Text> {/* Display the name based on rank */}
        <Text style={styles.userScore}>Score: {userData.score}</Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={[styles.rank, item.rank === 1 ? styles.gold : item.rank === 2 ? styles.silver : item.rank === 3 ? styles.bronze : styles.white]}>
              {item.rank}.
            </Text>
            <Text style={styles.nameColumn}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Top 3 Last Season</Text>
      {badgeData.map((player, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={[styles.rank, index === 0 ? styles.gold : index === 1 ? styles.silver : styles.bronze]}>
            {index + 1}.
          </Text>
          <Text style={styles.nameColumn}>{player.playerName}</Text>
          <Text style={styles.score}>{player.badge}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Badge Record Log</Text>
      <FlatList
        data={badgeData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.badgeText}>{item.playerName} earned {item.badge}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    textAlign: "center",
    color: "#000000",
    fontFamily: "Orbitron",
  },
  subHeader: {
    textAlign: "center",
    marginBottom: 10,
    color: "#000000",
    fontFamily: "Orbitron",
  },
  dropdown: {
    marginBottom: 12,
  },
  dropdownText: {
    fontFamily: "Orbitron",
  },
  userInfoBox: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
    alignItems: "center",
  },
  userRank: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Orbitron",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Orbitron",
  },
  userScore: {
    fontSize: 16,
    fontFamily: "Orbitron",
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  rank: {
    width: 50, 
    fontSize: 18,
    fontFamily: "Orbitron",
    textAlign: "left",
  },
  nameColumn: {
    flex: 1, 
    fontSize: 18,
    fontFamily: "Orbitron",
    color: "#000000",
  },
  score: {
    width: 80, 
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#000000",
    fontFamily: "Orbitron",
  },
  badgeText: {
    fontFamily: "Orbitron",
    fontSize: 16,
    color: "#000000",
  },
  gold: {
    color: "#ffd500",
    textShadowColor: "#ffd500",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  silver: {
    color: "#bababa",
    textShadowColor: "#bababa",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  bronze: {
    color: "#a7862a",
    textShadowColor: "#a7862a",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  white: {
    color: "#000000",
  },
});
