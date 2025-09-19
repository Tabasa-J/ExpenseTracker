// app/index.jsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // 🚀 Redirect to Welcome Page only
    router.replace("/welcomepage");
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFD700" /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
