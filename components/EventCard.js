// components/EventCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import SafeImage from "./SafeImage";

export default function EventCard({ item }) {
  const ticketsRemaining = item.number_of_tickets - item.tickets_bought;
  const price = item.price;
  const formattedDate = new Date(item.start_time).toLocaleString();
  const fallbackImage =
    "https://images.pexels.com/photos/8533585/pexels-photo-8533585.jpeg?auto=compress&cs=tinysrgb&w=1200";
  // Determine the image URI

  const imageUri =
    item.event_image && item.event_image.trim() !== ""
      ? item.event_image
      : null;

  return (
    <View style={styles.card}>
      <SafeImage
        source={{ uri: item.event_image }}
        style={styles.eventImage}
        resizeMode="cover"
      />

      <Text style={styles.ticketCount}>
        {ticketsRemaining} out of {item.number_of_tickets} tickets remaining
      </Text>
      <TouchableOpacity style={styles.priceButton}>
        <Text style={styles.priceText}>Buy ticket for £{price}</Text>
      </TouchableOpacity>
      <View style={styles.cardBody}>
        <Text style={styles.title}>“{item.title}”</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.location}>
          {item.loc_address}, {item.loc_postcode}, {item.loc_city}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
    backgroundColor: "white",
  },
  eventImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  ticketCount: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 6,
    borderRadius: 4,
  },
  priceButton: {
    position: "absolute",
    right: 10,
    top: 160,
    backgroundColor: "#d149a4",
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardBody: {
    paddingTop: 30,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    marginTop: 4,
    fontSize: 15,
    color: "#444",
  },
  date: {
    fontSize: 17,
    marginTop: 5,
  },
  location: {
    fontSize: 17,
    marginTop: 5,
  },
});
