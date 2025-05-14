import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { format } from "date-fns";

const EventsScreen = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/events/")
      .then((res) => {
        setEvents(res.data.events);
      })
      .catch((err) => {
        console.error("Error fetching events", err);
      });
  }, []);

  const renderEvent = ({ item }) => {
    const formattedDate = format(
      new Date(item.start_time),
      "EEEE do MMMM yyyy 'at' h:mm a"
    );

    const ticketsRemaining = item.number_of_tickets - item.tickets_bought;
    const price = item.price || 0; // fallback if price isn't included

    return (
      <View style={styles.card}>
        <Image
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
          <Text></Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.event_id.toString()}
      renderItem={renderEvent}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 0,
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
  description: {
    marginTop: 4,
    fontSize: 15,
    color: "#444",
  },
  cardBody: {
    paddingTop: 30,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
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

export default EventsScreen;
