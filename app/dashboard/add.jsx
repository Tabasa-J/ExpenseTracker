// app/dashboard/add.jsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDoc, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../src/services/firebaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  
  useEffect(() => {
    const fetchExpense = async () => {
      if (id) {
        const docRef = doc(db, "expenses", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTitle(data.title);
          setAmount(data.amount.toString());
          setDate(new Date(data.date));
        }
      }
    };
    fetchExpense();
  }, [id]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!title.trim() || !amount.trim()) {
      alert("Please enter title and amount.");
      return;
    }

    try {
      if (id) {
        
        const docRef = doc(db, "expenses", id);
        await updateDoc(docRef, {
          title,
          amount: parseFloat(amount),
          date: date.toISOString(),
        });
        alert("Expense updated!");
      } else {
        
        await addDoc(collection(db, "expenses"), {
          title,
          amount: parseFloat(amount),
          date: date.toISOString(),
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
        alert("Expense added!");
      }

      router.back();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense.");
    }
  };

  return (
    <LinearGradient colors={["#FFD700", "#121212"]} style={styles.container}>
      <Text style={styles.header}>{id ? "Edit Expense" : "Add Expense"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense Title"
        placeholderTextColor="#ccc"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#ccc"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          Date: {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{id ? "Update Expense" : "Save Expense"}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#fff",
  },
  dateButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateText: { color: "#fff", fontSize: 16 },
  saveButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveText: { fontSize: 16, fontWeight: "bold", color: "#121212" },
}); 
