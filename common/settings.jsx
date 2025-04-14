import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserPlus,
  faLifeRing,
  faCircleInfo,
  faFileContract,
  faComments,
  faArrowRightFromBracket,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import Config from "../config";
import jobsStyles from "../styles/jobs";
import authStyles from "../styles/auth";
import profileStyles from "../styles/profile";
import CustomButton from "./CustomButton";

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");
      const access = await SecureStore.getItemAsync("access");
      if (!refresh) {
        console.log("No refresh token found");
        return;
      }

      await axios.post(
        `${Config.BASE_URL}/logout/`,
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      await SecureStore.deleteItemAsync("access");
      await SecureStore.deleteItemAsync("refresh");
      axios.defaults.headers.common["Authorization"] = null;
      await Updates.reloadAsync();
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <SafeAreaView style={profileStyles.settings}>
      <Text style={profileStyles.h1}>Settings</Text>
      <View style={profileStyles.settingsButtons}>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faUserPlus} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Follow & Invite
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faLifeRing} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Help
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faCircleInfo} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faFileContract} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faComments} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Feedback
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setShowPasswordModal(true)}
        >
          <FontAwesomeIcon icon={faLock} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Change Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job} onPress={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Change Password</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Enter your current password"
            />
            <TextInput
              style={authStyles.input}
              placeholder="Enter the new password"
            />
            <TextInput
              style={authStyles.input}
              placeholder="Enter new password again"
            />
            <View style={profileStyles.button}>
              <CustomButton
                title={"Close"}
                onPress={() => setShowPasswordModal(false)}
              />
              <CustomButton title="Save" onPress={() => {}} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;
