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
  faExchange,
} from "@fortawesome/free-solid-svg-icons";
import { Picker } from "@react-native-picker/picker";

import Config from "../config";
import jobsStyles from "../styles/jobs";
import authStyles from "../styles/auth";
import profileStyles from "../styles/profile";
import CustomButton from "./CustomButton";

const Settings = ({ route }) => {
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { type, profile, handleSave } = route.params;
  const [formData, setFormData] =
    type === "creator"
      ? useState({
          user: {
            name: profile.user.name,
            username: profile.user.username,
            email: profile.user.email,
            password: "",
            profile_photo: null,
            bio: profile.user.bio,
          },
          date_of_birth: profile.date_of_birth,
          area: profile.area,
        })
      : useState({
          user: {
            name: profile.user.name,
            username: profile.user.username,
            email: profile.user.email,
            password: "",
            profile_photo: null,
            bio: profile.user.bio,
          },
          website: profile.website,
          target_audience: profile.target_audience,
        });

  const handleChange = (name, value) => {
    if (
      name === "date_of_birth" ||
      name === "area" ||
      name === "website" ||
      name === "target_audience"
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [name]: value },
      }));
    }
  };

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

  const AREA_OPTIONS = [
    { value: "", label: "Select Area" },
    { value: "art", label: "Art and Photography" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty and Makeup" },
    { value: "business", label: "Business" },
    { value: "diversity", label: "Diversity and Inclusion" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "fashion", label: "Fashion" },
    { value: "finance", label: "Finance" },
    { value: "food", label: "Food and Beverage" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health and Wellness" },
    { value: "home", label: "Home and Gardening" },
    { value: "outdoor", label: "Outdoor and Nature" },
    { value: "parenting", label: "Parenting and Family" },
    { value: "pets", label: "Pets" },
    { value: "sports", label: "Sports and Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "videography", label: "Videography" },
  ];

  // const clearSecureStoreTokens = async () => {
  //   try {
  //     await SecureStore.deleteItemAsync("access");
  //     await SecureStore.deleteItemAsync("refresh");
  //     console.log("Tokens cleared from SecureStore.");
  //   } catch (error) {
  //     console.error("Error clearing tokens from SecureStore:", error);
  //   }
  // };

  return (
    <SafeAreaView style={profileStyles.settings}>
      <Text style={profileStyles.h1}>Settings</Text>
      <View style={profileStyles.settingsButtons}>
        {/* <CustomButton title="Clear Tokens" onPress={clearSecureStoreTokens} /> */}
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faUserPlus} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>Follow & Invite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faLifeRing} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faCircleInfo} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faFileContract} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faComments} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setShowPasswordModal(true)}
        >
          <FontAwesomeIcon icon={faLock} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setShowAreaModal(true)}
        >
          <FontAwesomeIcon icon={faExchange} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>Change Category</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={jobsStyles.job}>
          <Text style={{ fontSize: 20, padding: 5 }}>Clear Tokens</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={jobsStyles.job} onPress={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>Logout</Text>
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
              <CustomButton
                title="Save"
                onPress={() => {
                  handleSave(formData);
                  setShowPasswordModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showAreaModal} transparent={true} animationType="slide">
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <View style={authStyles.input}>
              <Picker
                selectedValue={
                  type === "creator" ? profile.area : profile.target_audience
                }
                style={authStyles.picker}
                onValueChange={(value) => {
                  type === "creator"
                    ? handleChange("area", value)
                    : handleChange("target_audience", value);
                }}
              >
                {AREA_OPTIONS.map((area) => (
                  <Picker.Item
                    key={area.value}
                    label={area.label}
                    value={area.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={profileStyles.button}>
              <CustomButton
                title={"Close"}
                onPress={() => setShowAreaModal(false)}
              />
              <CustomButton
                title="Save"
                onPress={() => {
                  handleSave(formData);
                  setShowAreaModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;
