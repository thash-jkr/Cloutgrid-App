import { View, Text, Modal, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import CustomButton from "./CustomButton";
import * as ImagePicker from "expo-image-picker";

const EditProfileModal = ({ profile, onClose, onSave, type }) => {
  const [formData, setFormData] = type === "creator"
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
        area: profile.area
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
        target_audience: profile.target_audience
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

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0]["uri"];
      const fileName = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error("Failed to load image"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", localUri, true);
        xhr.send(null);
      });

      setFormData((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          profile_photo: {
            uri: localUri,
            name: fileName,
            type: fileType,
            file: blob,
          },
        },
      }));
    }
  };

  return (
    <View>
      <Modal transparent={true} animationType="slide">
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Name"
              value={formData.user.name}
              onChangeText={(value) => handleChange("name", value)}
            />

            <TextInput
              style={authStyles.input}
              placeholder="Bio"
              value={formData.user.bio}
              onChangeText={(value) => handleChange("bio", value)}
            />

            <View style={authStyles.input}>
              <TouchableOpacity onPress={handleFileChange}>
                <Text>Update Profile Photo</Text>
              </TouchableOpacity>
              {formData.user.profile_photo && (
                <Image
                  source={{ uri: profile.user.profile_photo }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}
            </View>

            {type === "business" && (
              <TextInput
                style={authStyles.input}
                placeholder="Website"
                value={formData.website}
                onChangeText={(value) => handleChange("website", value)}
              />
            )}

            <View style={profileStyles.button}>
              <CustomButton title="Close" onPress={onClose} />
              <CustomButton title="Save" onPress={() => onSave(formData)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfileModal;
