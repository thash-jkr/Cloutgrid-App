import {
  View,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import CustomButton from "../common/customButton";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useImageManipulator, SaveFormat } from "expo-image-manipulator";
import commonStyles from "../styles/common";
import { Picker } from "@react-native-picker/picker";

const { height, width } = Dimensions.get("window");

const MAX_SIZE_MB = 5;

const EditProfileModal = ({ profile, onClose, onSave, type }) => {
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [filename, setFilename] = useState("no file selected!");
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
  const [localUri, setLocalUri] = useState("");

  const manipulator = useImageManipulator(localUri);

  useEffect(() => {
    const compressIfNeeded = async () => {
      if (!localUri) {
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(localUri, { size: true });
      const imageSizeMB = fileInfo.size / (1024 * 1024);

      let finalUri = localUri;

      if (imageSizeMB > MAX_SIZE_MB) {
        const compressionRatio = MAX_SIZE_MB / imageSizeMB;
        const quality = Math.max(0.1, Math.min(1, compressionRatio));

        const manipulated = await manipulator.renderAsync();
        const result = await manipulated.saveAsync({
          compress: quality,
          format: SaveFormat.JPEG,
        });

        finalUri = result.localUri || result.uri;
      }

      const fileName = finalUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new Error("Failed to load image"));
        xhr.responseType = "blob";
        xhr.open("GET", finalUri, true);
        xhr.send(null);
      });

      setFilename(fileName);

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
    };

    compressIfNeeded();
  }, [localUri]);

  const handleChange = (name, value) => {
    if (name === "area" || name === "website" || name === "target_audience") {
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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLocalUri(result.assets[0].uri);
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

  return (
    <View>
      <Modal transparent={true} animationType="fade">
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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

            {type === "business" && (
              <TextInput
                style={authStyles.input}
                placeholder="Website"
                value={formData.website}
                onChangeText={(value) => handleChange("website", value)}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: width * 0.95,
                marginBottom: 5,
              }}
            >
              <CustomButton
                title={"Change Picture"}
                onPress={handleFileChange}
              />
              <Text style={[commonStyles.text, { marginRight: 15 }]}>
                {filename.length > 20
                  ? filename.substring(0, 20) + "..."
                  : filename}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: width * 0.95,
                marginBottom: 5,
              }}
            >
              <CustomButton
                title={"Category"}
                onPress={() => setShowAreaModal(true)}
              />
              <Text style={[commonStyles.text, { marginRight: 15 }]}>
                {type === "creator" ? formData.area : formData.target_audience}
              </Text>
            </View>

            <View
              style={[
                profileStyles.button,
                {
                  borderTopColor: "#ddd",
                  borderTopWidth: 1,
                  width: "90%",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <CustomButton title="Close" onPress={onClose} />
              <CustomButton title="Save" onPress={() => onSave(formData)} />
            </View>
          </View>
        </KeyboardAvoidingView>

        <Modal visible={showAreaModal} transparent={true} animationType="slide">
          <View style={profileStyles.modalContainer}>
            <View style={profileStyles.modalContent}>
              <View
                style={
                  Platform.OS === "ios"
                    ? {}
                    : [
                        authStyles.input,
                        { width: width * 0.7, flexDirection: "column" },
                      ]
                }
              >
                {Platform.OS === "android" && (
                  <Text>Select from dropdown 👉🏻</Text>
                )}
                <Picker
                  selectedValue={
                    type === "creator"
                      ? formData.area
                      : formData.target_audience
                  }
                  style={[
                    authStyles.picker,
                    { marginBottom: Platform.OS === "ios" ? 250 : 10 },
                  ]}
                  onValueChange={(value) => {
                    type === "creator"
                      ? handleChange("area", value)
                      : handleChange("target_audience", value);
                    Platform.OS === "android" && setShowAreaModal(false);
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
              </View>
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
};

export default EditProfileModal;
