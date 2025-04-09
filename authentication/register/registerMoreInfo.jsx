import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import authStyles from "../../styles/auth";
import CustomButton from "../../common/CustomButton";
import Config from "../../config";
import Loader from "../../common/loading";

const AdditionalInfo = ({ formData, setFormData, handleChange, type }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);

    const formattedDate = currentDate.toISOString().split("T")[0];
    handleChange("date_of_birth", formattedDate);
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const data = new FormData();
      data.append("user.name", formData.user.name);
      data.append("user.email", formData.user.email);
      data.append("user.username", formData.user.username);
      data.append("user.password", formData.user.password);
      data.append("user.bio", formData.user.bio);

      if (type === "creator") {
        data.append("date_of_birth", formData.date_of_birth);
        data.append("area", formData.area);
      } else {
        data.append("website", formData.website);
        data.append("target_audience", formData.target_audience);
      }

      if (formData.user.profile_photo) {
        data.append("user.profile_photo", {
          uri: formData.user.profile_photo.uri,
          name: formData.user.profile_photo.name,
          type: formData.user.profile_photo.type,
        });
      }

      await axios.post(`${Config.BASE_URL}/register/${type}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Registration Successful",
        "You have successfully registered."
      );
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error: ", error);
    } finally {
      setIsLoading(false)
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
    <View style={authStyles.container}>
      <Loader visible={isLoading}/>
      <Text style={authStyles.h1}>Additional Information</Text>

      <View style={authStyles.input}>
        <TouchableOpacity onPress={handleFileChange}>
          <Text style={{ color: "#000", fontFamily: "FacultyGlyphic-Regular" }}>
            Select a Profile Photo:
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {formData.user.profile_photo && (
            <FontAwesomeIcon icon={faCheck} color="green" size={20} />
          )}
        </View>
      </View>

      {type === "creator" ? (
        <View>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={authStyles.input}
          >
            <Text
              style={{ color: "#000", fontFamily: "FacultyGlyphic-Regular" }}
            >
              Date of Birth: {formData.date_of_birth}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      ) : (
        <TextInput
          style={authStyles.input}
          placeholder="Enter your website address:"
          placeholderTextColor="#000"
          value={formData.website}
          onChangeText={(value) => handleChange("website", value)}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowAreaModal(true)}
        style={authStyles.input}
      >
        <Text style={{ color: "#000", fontFamily: "FacultyGlyphic-Regular" }}>
          {type === "creator"
            ? formData.area
              ? formData.area
              : "Select your area of expertise:"
            : formData.target_audience
            ? formData.target_audience
            : "Select your business category:"}
        </Text>
      </TouchableOpacity>

      <Modal visible={showAreaModal} transparent={true} animationType="slide">
        <View style={authStyles.modalOverlay}>
          <View style={authStyles.modalContainer}>
            <Picker
              selectedValue={
                type === "creator" ? formData.area : formData.target_audience
              }
              style={authStyles.picker}
              onValueChange={(value) => {
                type === "creator"
                  ? handleChange("area", value)
                  : handleChange("target_audience", value);
              }}
            >
              {AREA_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
            <CustomButton
              title="Close"
              onPress={() => setShowAreaModal(false)}
            />
          </View>
        </View>
      </Modal>

      <CustomButton title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default AdditionalInfo;
