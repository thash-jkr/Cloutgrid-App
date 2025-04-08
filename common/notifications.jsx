import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import homeStyles from "../styles/home";
import Config from "../config";

const Notifications = () => {
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const accessToken = await SecureStore.getItemAsync("access");
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/notifications/?all=${showAll}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [showAll]);

  const handleClose = async (id) => {
    const accessToken = await SecureStore.getItemAsync("access");
    try {
      await axios.post(
        `${Config.BASE_URL}/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  return (
    <SafeAreaView style={homeStyles.home}>
      <Text style={homeStyles.h2}>Notifications</Text>
      <View style={homeStyles.toggle}>
        <Text style={homeStyles.toggleText}>Show All</Text>
        <Switch
          value={!showAll}
          onChange={() => setShowAll(!showAll)}
          trackColor={{ false: "#ddd", true: "#0077B6" }}
          thumbColor="#03045E"
          ios_backgroundColor="#3e3e3e"
        />
        <Text style={homeStyles.toggleText}>Show unread</Text>
      </View>
      <ScrollView
        style={homeStyles.bars}
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        {notifications.length > 0 ? (
          <View
            style={{
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={homeStyles.bar}
                onPress={() => handleClose(notification.id)}
              >
                <Text style={{fontFamily: "sen-400"}}>{notification.message}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text>No notifications</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
