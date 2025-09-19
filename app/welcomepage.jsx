// app/welcome.jsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Big Logo */}
      <Image
        source={require("../assets/images/logo.png")} // 👈 place your logo here
        style={styles.logo}
      />

      {/* App Name */}
      <Text style={styles.title}>My Expense Tracker</Text>

      {/* Tagline */}
      <Text style={styles.subtitle}>
        Track your expenses easily and take control of your budget.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // black background
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD700", // golden yellow
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FFD700", // golden yellow button
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: "#000", // black text on yellow
    fontSize: 18,
    fontWeight: "bold",
  },
});
