import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import homeStyles from "../styles/home";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../slices/notificationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import commonStyles from "../styles/common";
import { useNavigation } from "@react-navigation/native";

const Notifications = () => {
  const [showAll, setShowAll] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { items, status, error } = useSelector((state) => state.notif);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchNotifications(showAll));
  }, [dispatch, showAll]);

  const handleClose = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: 20,
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={commonStyles.center}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            style={{ marginRight: 20 }}
          />
          <Text style={commonStyles.backText}>Notifications</Text>
        </TouchableOpacity>
      </View>
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
    </View>
  );
};

export default Notifications;
