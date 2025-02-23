import { View, Text, TextInput, Button, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useState } from "react";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");

  // Sample user statistics data
  const totalGamesPlayed = 25; // Replace with actual data
  const averageScore = 85; // Replace with actual data
  const correctAnswersPercentage = 78; // Replace with actual data
  const totalPoints = 2100; // Total points earned throughout account history (replace with actual data)
  const recentActivity = [
    { game: "Math Challenge", score: 90 },
    { game: "History Quiz", score: 80 },
    { game: "Science Test", score: 88 },
  ]; // Replace with actual data

  const handleSave = () => {
    // Add logic to save the profile information
    console.log("Profile saved:", { name, year, major });
  };

  return (
    <SafeAreaView className="min-h-full">
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        style={styles.input}
        placeholder="Major"
        value={major}
        onChangeText={setMajor}
      />

      <Button title="Save" onPress={handleSave} />

      {/* User Statistics Section */}
      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticTitle}>User Statistics</Text>
        <View style={styles.statisticItem}>
          <Text style={styles.statisticText}>Total Games Played:</Text>
          <Text style={styles.statisticValue}>{totalGamesPlayed}</Text>
        </View>
        <View style={styles.statisticItem}>
          <Text style={styles.statisticText}>Average Score:</Text>
          <Text style={styles.statisticValue}>{averageScore}</Text>
        </View>
        <View style={styles.statisticItem}>
          <Text style={styles.statisticText}>Correct Answers Percentage:</Text>
          <Text style={styles.statisticValue}>{correctAnswersPercentage}%</Text>
        </View>
        <View style={styles.statisticItem}>
          <Text style={styles.statisticText}>Total Points Earned:</Text>
          <Text style={styles.statisticValue}>{totalPoints}</Text>
        </View>
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivity}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>{item.game}: </Text>
              <Text style={styles.activityScore}>{item.score}</Text>
            </View>
          )}
        />
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Orbitron", // Added Orbitron font
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontFamily: "Orbitron", // Added Orbitron font
  },
  statisticsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statisticTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Orbitron", // Added Orbitron font
  },
  statisticItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  statisticText: {
    fontFamily: "Orbitron", // Added Orbitron font
  },
  statisticValue: {
    fontFamily: "Orbitron", // Added Orbitron font
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    fontFamily: "Orbitron", // Added Orbitron font
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  activityText: {
    fontFamily: "Orbitron", // Added Orbitron font
  },
  activityScore: {
    fontFamily: "Orbitron", // Added Orbitron font
  },
});
