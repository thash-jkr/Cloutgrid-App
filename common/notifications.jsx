import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";

import homeStyles from "../styles/home";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../slices/notificationSlice";

const Notifications = () => {
  const [showAll, setShowAll] = useState(false);

  const dispatch = useDispatch();

  const { items, status, error } = useSelector((state) => state.notif);

  useEffect(() => {
    dispatch(fetchNotifications(showAll));
  }, [dispatch, showAll]);

  const handleClose = (id) => {
    dispatch(markAsRead(id));
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
        {items.length > 0 ? (
          <View
            style={{
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {items.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={homeStyles.bar}
                disabled={showAll}
                onPress={() => handleClose(notification.id)}
              >
                <Text style={{ fontFamily: "sen-400" }}>
                  {notification.message}
                </Text>
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
