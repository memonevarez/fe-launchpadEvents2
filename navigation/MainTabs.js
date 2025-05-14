import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import EventsScreen from "../screens/EventsScreen";
import PostScreen from "../screens/PostScreen";
import MyEventsScreen from "../screens/MyEventsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { AuthContext } from "../context/AuthContext";
import { TouchableOpacity, Text } from "react-native";

const Tab = createBottomTabNavigator();

function withHeader(Component, title) {
  return function WrappedScreen({ navigation }) {
    const { logout } = useContext(AuthContext);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        title,
        headerRight: () => (
          <TouchableOpacity onPress={logout}>
            <Text style={{ marginRight: 15, color: "red", fontWeight: "bold" }}>
              Logout
            </Text>
          </TouchableOpacity>
        ),
      });
    }, [navigation]);

    return <Component {...{ navigation }} />;
  };
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Events") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "MyEvents") {
            iconName = focused ? "albums" : "albums-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Events"
        component={withHeader(EventsScreen, "Events")}
      />
      <Tab.Screen name="Post" component={withHeader(PostScreen, "Post")} />
      <Tab.Screen
        name="MyEvents"
        component={withHeader(MyEventsScreen, "My Events")}
      />
      <Tab.Screen
        name="Profile"
        component={withHeader(ProfileScreen, "Profile")}
      />
    </Tab.Navigator>
  );
}
