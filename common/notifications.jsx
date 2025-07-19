import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import homeStyles from "../styles/home";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../slices/notificationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import commonStyles from "../styles/common";
import { useNavigation } from "@react-navigation/native";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { items, status, error } = useSelector((state) => state.notif);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchNotifications(false));
  }, [dispatch]);

  const handleClose = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View style={commonStyles.pageHeader}>
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
              <TouchableOpacity key={notification.id} style={homeStyles.bar}>
                <Text style={[commonStyles.text, { maxWidth: "90%" }]}>
                  {notification.message}
                </Text>
                <TouchableOpacity onPress={() => handleClose(notification.id)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </TouchableOpacity>
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
