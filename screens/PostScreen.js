import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { useNavigation } from "@react-navigation/native";
import { ToastAndroid, Platform, Alert } from "react-native";
import SafeImage from "../components/SafeImage";
import { uploadImageAsync } from "../utils/UploadImage";

export default function PostScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    loc_address: "",
    loc_city: "",
    loc_postcode: "",
    start_time: new Date(),
    end_time: new Date(),
    event_image:
      "https://images.pexels.com/photos/8533585/pexels-photo-8533585.jpeg?auto=compress&cs=tinysrgb&w=1200",
    number_of_tickets: 0,
    tickets_bought: 0,
    price: 0,
  });
  const fallbackImage =
    "https://images.pexels.com/photos/8533585/pexels-photo-8533585.jpeg?auto=compress&cs=tinysrgb&w=1200";

  const showSuccessMessage = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", message);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Need access to photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLoading(true);
      try {
        const downloadUrl = await uploadImageAsync(uri);
        setForm((f) => ({ ...f, event_image: downloadUrl }));
      } catch (e) {
        console.error(e);
        Alert.alert("Upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const body = {
      ...form,
      created_by: user.user_id,
      start_time: form.start_time.toISOString(),
      end_time: form.end_time.toISOString(),
    };

    try {
      const res = await fetch("http://localhost:9090/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      console.log("Posted:", json);
      //Reset form
      setForm({
        title: "",
        description: "",
        loc_address: "",
        loc_city: "",
        loc_postcode: "",
        start_time: new Date(),
        end_time: new Date(),
        event_image:
          "https://images.pexels.com/photos/8533585/pexels-photo-8533585.jpeg?auto=compress&cs=tinysrgb&w=1200",
        number_of_tickets: 300,
        tickets_bought: 0,
        price: 0,
      });

      showSuccessMessage("Event posted!");
      navigation.navigate("MyEvents", { reload: true });
    } catch (error) {
      console.error("Post failed", error);
      Alert.alert("Error", "Failed to post event.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label,
    field,
    placeholder,
    multiline = false,
    keyboardType = "default"
  ) => (
    <View style={styles.fieldRow}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={[styles.input, multiline && styles.textArea]}
        multiline={multiline}
        keyboardType={keyboardType}
        value={form[field]?.toString()}
        onChangeText={(text) =>
          handleChange(
            field,
            keyboardType === "numeric" ? parseFloat(text) || 0 : text
          )
        }
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Event</Text>

      {renderField("Title", "title", "e.g. Summer BBQ")}
      {renderField("Description", "description", "What’s it about?", true)}
      {renderField("Address", "loc_address", "123 Main St")}
      {renderField("City", "loc_city", "London")}
      {renderField("Postcode", "loc_postcode", "SW1A 1AA")}
      {renderField(
        "Tickets",
        "number_of_tickets",
        "Total tickets",
        false,
        "numeric"
      )}
      {renderField(
        "Bought",
        "tickets_bought",
        "Tickets sold",
        false,
        "numeric"
      )}
      {renderField("Price (£)", "price", "15.00", false, "numeric")}

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Start</Text>
        <DateTimePicker
          value={form.start_time}
          mode="datetime"
          style={styles.picker}
          onChange={(e, date) => date && handleChange("start_time", date)}
        />
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>End</Text>
        <DateTimePicker
          value={form.end_time}
          mode="datetime"
          style={styles.picker}
          onChange={(e, date) => date && handleChange("end_time", date)}
        />
      </View>

      <View style={styles.fieldRow}>
        <Text style={styles.label}>Image</Text>
        <View style={{ flex: 1 }}>
          <Button title="Select Image" onPress={handlePickImage} />
          <SafeImage
            source={{
              uri:
                form.event_image && form.event_image.trim() !== ""
                  ? form.event_image
                  : fallbackImage,
            }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <Text style={styles.previewTitle}>Live Preview</Text>
      <EventCard item={form} />

      <Button
        title={loading ? "Posting..." : "Post Event"}
        onPress={handleSubmit}
        disabled={loading}
      />
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
    color: "#333",
    textAlign: "center",
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  picker: {
    flex: 1,
  },
  previewTitle: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
});
