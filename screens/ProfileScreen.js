import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ToastAndroid,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ ...user });
  const [original, setOriginal] = useState({ ...user });
  const [pendingStaff, setPendingStaff] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [staffRequested, setStaffRequested] = useState(false);

  useEffect(() => {
    (async () => {
      const pending = await AsyncStorage.getItem("pendingStaffRequest");
      setPendingStaff(pending === "true");
    })();
  }, []);

  const showMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert("Info", msg);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Allow access to photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setForm({ ...form, avatar_url: uri });
      setAvatarChanged(true);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(form));
      setOriginal({ ...form });
      showMessage("Profile saved!");
    } catch (err) {
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  const handleRequestStaff = async () => {
    setStaffRequested(true);
  };

  const hasChanges = () =>
    avatarChanged ||
    Object.keys(form).some((key) => form[key] !== original[key]);

  const renderField = (
    label,
    field,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default"
  ) => (
    <View style={styles.fieldRow}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={form[field]}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={(text) => handleChange(field, text)}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
        <Image source={{ uri: form.avatar_url }} style={styles.avatar} />
        <Text style={styles.changeAvatarText}>Change Avatar</Text>
      </TouchableOpacity>

      {renderField("Username", "username", "e.g. memonevarez")}
      {renderField("Name", "name", "Your full name")}
      {renderField("Email", "email", "you@example.com")}
      {renderField("Password", "password_hash", "••••••••", true)}

      {!user.is_staff && (
        <View style={{ marginVertical: 20 }}>
          {!staffRequested ? (
            <Button
              title="Request to become a Staff member"
              onPress={handleRequestStaff}
            />
          ) : (
            <Text style={{ color: "gray", textAlign: "center" }}>
              Staff member authorisation pending
            </Text>
          )}
        </View>
      )}

      <View style={{ marginTop: 30 }}>
        <Button
          title="Save changes"
          onPress={handleSave}
          disabled={!hasChanges()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fafafa",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    width: 100,
    fontSize: 16,
    textAlign: "right",
    paddingRight: 10,
    color: "#444",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  changeAvatarText: {
    marginTop: 8,
    color: "#007bff",
    fontSize: 14,
  },
  staffSection: {
    marginTop: 20,
    alignItems: "center",
  },
  pendingText: {
    fontStyle: "italic",
    color: "#888",
    fontSize: 16,
  },
});
