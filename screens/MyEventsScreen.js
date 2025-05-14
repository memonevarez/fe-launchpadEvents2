import React, { useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { Linking } from "react-native";

export default function MyEventsScreen() {
  const { user } = useContext(AuthContext);
  const [signedUp, setSignedUp] = useState([]);
  const [created, setCreated] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created"); // 'created', 'signedUp', 'bookmarked'

  const TABS = [
    { key: "created", label: "Created" },
    { key: "signedUp", label: "Signed Up" },
    { key: "bookmarked", label: "Bookmarked" },
  ];

  useFocusEffect(
    useCallback(() => {
      if (user?.user_id) {
        fetchEvents();
      }
    }, [user?.user_id])
  );

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`http://localhost:9090/api/users/${user.user_id}/attending`),
        fetch(`http://localhost:9090/api/users/${user.user_id}/created-events`),
        fetch(
          `http://localhost:9090/api/events/bookmarked?userId=${user.user_id}`
        ),
      ]);

      const signed = await r1.json();
      const createdEvents = await r2.json();
      const bookmarked = await r3.json();

      setCreated(createdEvents.events);
      setSignedUp(signed.events);
      setBookmarked(bookmarked);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`http://localhost:9090/api/events/${eventId}`, {
              method: "DELETE",
            });
            setCreated((prev) => prev.filter((e) => e.event_id !== eventId));
          } catch (err) {
            console.error("Delete failed", err);
            Alert.alert("Error", "Could not delete event.");
          }
        },
      },
    ]);
  };

  const handleUnbookmark = async (eventId) => {
    try {
      await fetch(`http://localhost:9090/api/events/${eventId}/unbookmark`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      setBookmarked((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error("Unbookmark failed", err);
      Alert.alert("Error", "Could not remove bookmark.");
    }
  };

  const handleAddToCalendar = (event) => {
    const start = new Date(event.start_time)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.end_time)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.loc_address || "");

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;

    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Could not open calendar")
    );
  };

  const renderSection = (title, data, actionType) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!data ? (
        <Text style={styles.empty}>No events found.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.event_id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <EventCard item={item} />
              {actionType === "delete" && (
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => handleDelete(item.event_id)}
                />
              )}
              {actionType === "calendar" && (
                <Button
                  title="Add to Google Calendar"
                  onPress={() => handleAddToCalendar(item)}
                />
              )}
              {actionType === "unbookmark" && (
                <Button
                  title="Remove Bookmark"
                  onPress={() => handleUnbookmark(item.id)}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        {activeTab === "created" &&
          renderSection("Events You Created", created, "delete")}
        {activeTab === "signedUp" &&
          renderSection("Events You Signed Up For", signedUp, "calendar")}
        {activeTab === "bookmarked" &&
          renderSection("Bookmarked Events", bookmarked, "unbookmark")}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fafafa",
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    marginBottom: 15,
  },
  empty: {
    color: "#777",
    fontStyle: "italic",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#eee",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#007AFF", // iOS blue
  },
  tabText: {
    color: "#444",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
