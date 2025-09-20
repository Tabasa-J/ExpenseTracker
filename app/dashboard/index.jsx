// app/dashboard/index.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { db, auth } from "../../src/services/firebaseConfig";

export default function ExpenseTracker() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, []);

  const handleSaveExpense = async () => {
    if (!title || !amount) {
      Alert.alert("Error", "Please enter title and amount!");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "expenses", editingId), {
          title,
          amount: parseFloat(amount),
          date: date.toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setEditingId(null);
        Alert.alert("Updated", "Expense updated ✅");
      } else {
        await addDoc(collection(db, "expenses"), {
          title,
          amount: parseFloat(amount),
          date: date.toISOString(),
          userId: auth.currentUser.uid,
          createdAt: new Date().toISOString(),
        });
        Alert.alert("Added", "Expense added ✅");
      }
      setTitle("");
      setAmount("");
      setDate(new Date());
    } catch (err) {
      Alert.alert("Error", "Something went wrong ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      Alert.alert("Deleted", "Expense removed 🗑️");
    } catch (err) {
      Alert.alert("Error", "Could not delete ❌");
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setAmount(item.amount.toString());
    setDate(new Date(item.date));
    setEditingId(item.id);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      Alert.alert("Logout Error", err.message);
    }
  };

 
  const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#121212" : "#fff" },
      ]}
    >
      
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.title, { color: darkMode ? "#FFD700" : "#121212" }]}>
            Expense Tracker
          </Text>
          <Text style={[styles.totalText, { color: darkMode ? "#fff" : "#333" }]}>
            Total Expense: ₱{totalExpenses.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
      </View>

      
      {showMenu && (
        <View style={styles.dropdown}>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>⚙️ Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={[styles.menuText, { color: "#c62828" }]}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      )}

    
      <View
        style={[
          styles.addCard,
          { backgroundColor: darkMode ? "#1e1e1e" : "#f9f9f9" },
        ]}
      >
        <TextInput
          placeholder="Expense title..."
          placeholderTextColor={darkMode ? "#aaa" : "#666"}
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: darkMode ? "#fff" : "#121212" }]}
        />

        <TextInput
          placeholder="Amount"
          placeholderTextColor={darkMode ? "#aaa" : "#666"}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={[styles.input, { color: darkMode ? "#fff" : "#121212" }]}
        />

        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: darkMode ? "#333" : "#eee" }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: darkMode ? "#FFD700" : "#121212" }}>
            {date.toDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: "#FFD700" }]}
          onPress={handleSaveExpense}
        >
          <Text style={styles.addButtonText}>{editingId ? "✓" : "＋"}</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: darkMode ? "#1e1e1e" : "#fff" },
            ]}
          >
            <Text style={[styles.cardTitle, { color: "#FFD700" }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardAmount, { color: darkMode ? "#fff" : "#121212" }]}>
              ₱{item.amount}
            </Text>
            <Text style={[styles.cardDate, { color: darkMode ? "#aaa" : "#555" }]}>
              {new Date(item.date).toDateString()}
            </Text>

           
            <View style={styles.cardBottom}>
              {item.createdAt && (
                <Text style={[styles.timeOnly, { color: darkMode ? "#aaa" : "#777" }]}>
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              )}
              <View style={styles.cardButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Text style={styles.editText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: darkMode ? "#aaa" : "#888" }]}>
            No expenses yet. Add one!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    
  },
  title: { fontSize: 28, fontWeight: "bold" },
  totalText: { fontSize: 18, fontWeight: "600", marginTop: 4 },
  menuButton: { fontSize: 24, color: "#FFD700", paddingHorizontal: 10 },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: { fontSize: 16, color: "#121212" },

  addCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD700",
    marginBottom: 10,
    paddingVertical: 4,
  },
  dateButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "#121212", fontSize: 26, fontWeight: "bold" },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardAmount: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  cardDate: { fontSize: 14, marginTop: 4 },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timeOnly: { fontSize: 12, fontStyle: "italic" },

  cardButtons: { flexDirection: "row" },
  editText: { marginRight: 16, color: "#1976d2", fontWeight: "600" },
  deleteText: { color: "#d32f2f", fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 30, fontSize: 15 },
});
