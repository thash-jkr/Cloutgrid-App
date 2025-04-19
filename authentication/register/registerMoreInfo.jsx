import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import authStyles from "../../styles/auth";
import CustomButton from "../../common/CustomButton";
import Config from "../../config";
import Loader from "../../common/loading";
import commonStyles from "../../styles/common";

const { height, width } = Dimensions.get("window");

const AdditionalInfo = ({ formData, setFormData, handleChange, type }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState("no file selected!");

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
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      const localUri = result.assets[0]["uri"];
      const fileName = localUri.split("/").pop();
      setFilename(fileName);
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
      setIsLoading(true);
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
      setIsLoading(false);
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
      <Loader visible={isLoading} />
      <Text style={authStyles.h1}>Additional Information</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: width * 0.95,
          marginBottom: 15,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
          borderTopColor: "#ddd",
          borderTopWidth: 1,
        }}
      >
        <CustomButton title={"Select Image"} onPress={handleFileChange} />
        <Text style={[commonStyles.text, { marginRight: 10 }]}>
          {filename.length > 20 ? filename.substring(0, 20) + "..." : filename}
        </Text>
      </View>

      {type === "creator" ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: width * 0.95,
            marginBottom: 15,
            borderBottomColor: "#ddd",
            borderBottomWidth: 1,
          }}
        >
          <CustomButton
            title={"Date of Birth"}
            onPress={() =>
              Platform.OS === "ios"
                ? setShowDateModal(true)
                : setShowDatePicker(true)
            }
          />
          <Text style={[commonStyles.text, { marginRight: 10 }]}>
            {formData.date_of_birth
              ? formData.date_of_birth
              : "Select your DOB!"}
          </Text>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={"spinner"}
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

      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: width * 0.95,
            marginBottom: 15,
            borderBottomColor: "#ddd",
            borderBottomWidth: 1,
          },
          type === "creator"
            ? {}
            : {
                borderTopColor: "#ddd",
                borderTopWidth: 1,
              },
        ]}
      >
        <CustomButton
          title={"Category"}
          onPress={() => setShowAreaModal(true)}
        />
        <Text style={[commonStyles.text, { marginRight: 10 }]}>
          {type === "creator"
            ? formData.area
              ? formData.area
              : "Select your area of expertise"
            : formData.target_audience
            ? formData.target_audience
            : "Select your business category"}
        </Text>
      </View>

      <Modal visible={showDateModal} transparent={true} animationType="slide">
        <View style={authStyles.modalOverlay}>
          <View style={authStyles.modalContainer}>
            <DateTimePicker
              value={date}
              mode="date"
              display={"spinner"}
              onChange={handleDateChange}
            />
            <CustomButton
              title="Close"
              onPress={() => setShowDateModal(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showAreaModal} transparent={true} animationType="slide">
        <View style={authStyles.modalOverlay}>
          <View style={authStyles.modalContainer}>
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
                  type === "creator" ? formData.area : formData.target_audience
                }
                style={[
                  authStyles.picker,
                  { marginBottom: Platform.OS === "ios" ? 250 : 10 },
                ]}
                onValueChange={(value) => {
                  type === "creator"
                    ? handleChange("area", value)
                    : handleChange("target_audience", value);
                  setShowAreaModal(false);
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
