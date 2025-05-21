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
  ScrollView,
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
import jobsStyles from "../../styles/jobs";
import profileStyles from "../../styles/profile";

const { height, width } = Dimensions.get("window");

const AdditionalInfo = ({ formData, setFormData, handleChange, type }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState(null);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

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
    { value: "", label: "Select One" },
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
        <CustomButton title={"Profile Photo"} onPress={handleFileChange} />
        <Text style={[commonStyles.text, { marginRight: 10 }]}>
          {filename ? filename.length > 20 ? filename.substring(0, 20) + "..." : filename : "Select a Profile Photo"}
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

      <View style={commonStyles.center}>
        <Text>By clicking continue, you agree to our </Text>
        <TouchableOpacity
          onPress={() => {
            setPrivacyModal(true);
          }}
        >
          <Text style={{ fontWeight: "600", color: "blue" }}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showDateModal} transparent={true} animationType="fade">
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

      <Modal visible={showAreaModal} transparent={true} animationType="fade">
        <View style={jobsStyles.modalContainer}>
          <View style={jobsStyles.modalContent}>
            <Text style={jobsStyles.modalTitle}>
              {type === "creator"
                ? "Select your area of expertise"
                : "Select your business category"}
            </Text>
            <Picker
              selectedValue={formData.target_creator}
              style={jobsStyles.picker}
              onValueChange={(value) => {
                type === "creator"
                  ? handleChange("area", value)
                  : handleChange("target_audience", value);
                setShowAreaModal(false);
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

      <Modal visible={privacyModal} transparent={true} animationType="fade">
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Privacy Policy</Text>
            <ScrollView style={{ padding: 10, maxHeight: 400 }}>
              <Text style={{ fontStyle: "italic", marginBottom: 16 }}>
                Last updated: May 09, 2025
              </Text>

              <Text style={{ marginBottom: 16 }}>
                This Privacy Policy describes our policies and procedures on the
                collection, use, and disclosure of your information when you use
                the Cloutgrid app (“the Service”) and tells you about your
                privacy rights and how the law protects you. By using the
                Service, you agree to the collection and use of information in
                accordance with this Privacy Policy.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Summary of Data Collection
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid collects the following data types, which are linked to
                your identity and used solely for the app’s functionality:
                {"\n"}- Name – used for your profile and display to other users
                {"\n"}- Email address – used for account login, communication,
                and account recovery
                {"\n"}- Photos or videos – used for posting content and
                customizing your profile
                {"\n"}- User ID – used to identify your account and provide
                personalized functionality
                {"\n\n"}We do not use your data for tracking, targeted
                advertising, or data brokering.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Interpretation and Definitions
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Application refers to Cloutgrid, the software application
                provided by CLOUTIVITY PRIVATE LIMITED.{"\n"}
                Company refers to CLOUTIVITY PRIVATE LIMITED, Kerala, India.
                {"\n"}
                Personal Data means information relating to an identified or
                identifiable individual.{"\n"}
                Service refers to the Application.{"\n"}
                You means the individual accessing or using the Service.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Types of Data Collected
              </Text>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Personal Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                The following personal data is collected and linked to your
                identity:
                {"\n"}- Name
                {"\n"}- Email address
                {"\n"}- Photos or videos you upload
                {"\n"}- User ID or account identifier
              </Text>

              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Usage Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Usage data may include information such as device type,
                operating system, screen size, and app usage metrics. This helps
                us improve the performance and security of the Service.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Use of Your Personal Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We use the data we collect to provide and maintain the Service,
                manage your account, enable features like profile creation and
                content posting, respond to support needs, and improve app
                performance.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Sharing Your Personal Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We may share your data with trusted service providers, during
                business transfers, or when legally required. Your data will
                never be sold for advertising or marketing purposes.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Data Retention
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Your data is retained only for as long as necessary to provide
                our services or comply with legal requirements.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Security
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We follow industry-standard practices to protect your data, but
                no method of storage or transmission is 100% secure.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Children’s Privacy
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Our Service is not intended for users under the age of 13. If
                you believe your child has provided us with data, please contact
                us immediately.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Your Rights
              </Text>
              <Text style={{ marginBottom: 16 }}>
                You may view, update, or request deletion of your personal data
                from your account settings or by contacting us.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Changes to This Privacy Policy
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We may update this policy and will notify you of significant
                changes via email or in-app alerts.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Contact Us
              </Text>
              <Text style={{ marginBottom: 32 }}>
                If you have any questions, please contact us at:
                {"\n"}Email: info@cloutgrid.com
              </Text>
            </ScrollView>
            <CustomButton
              title={"Close"}
              onPress={() => setPrivacyModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* <Modal visible={showAreaModal} transparent={true} animationType="fade">
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
      </Modal> */}

      <CustomButton title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default AdditionalInfo;
