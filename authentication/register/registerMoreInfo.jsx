import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "../../common/customButton";
import Config from "../../config";
import Loader from "../../common/loading";
import commonStyles from "../../styles/common";
import jobsStyles from "../../styles/jobs";
import profileStyles from "../../styles/profile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import PrivacyModal from "../../modals/privacyModal";
import EulaModal from "../../modals/eulaModal";

const { height, width } = Dimensions.get("window");

const AdditionalInfo = ({ formData, handleChange, prevStep, type }) => {
  const [categoryModal, setCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [eulaModal, setEulaModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    try {
      if (formData.user.password !== confirmPassword) {
        Alert.alert("Error", "Passwords must match!");
      } else if (!formData.user.password) {
        Alert.alert("Error", "Please enter a password!");
      } else if (
        (type === "creator" && !formData.area) ||
        (type === "business" && !formData.target_audience)
      ) {
        Alert.alert("Error", "Please select your category");
      }

      setIsLoading(true);
      const data = new FormData();
      data.append("user.name", formData.user.name);
      data.append("user.email", formData.user.email);
      data.append("user.username", formData.user.username);
      data.append("user.password", formData.user.password);
      data.append("user.bio", formData.user.bio);

      if (type === "creator") {
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

  const AREA_OPTIONS_OBJECT = AREA_OPTIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <Loader visible={isLoading} />

      <View style={commonStyles.pageHeader}>
        <TouchableOpacity onPress={prevStep} style={commonStyles.center}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            style={{ marginRight: 20 }}
          />
          <Text style={commonStyles.backText}>Additional Information</Text>
        </TouchableOpacity>
      </View>

      <View style={commonStyles.centerVertical}>
        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Password: </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutContent({
                  title: "Password",
                  body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                });
                aboutModalize.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter a strong password"
            value={formData.user.password}
            onChangeText={(value) => handleChange("password", value)}
            style={commonStyles.input}
            placeholderTextColor={"#999"}
            secureTextEntry={true}
          />
        </View>

        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Confirm Password: </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutContent({
                  title: "Password",
                  body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                });
                aboutModalize.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter the password again"
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            style={commonStyles.input}
            placeholderTextColor={"#999"}
            secureTextEntry={true}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: width * 0.95,
            marginBottom: 10,
          }}
        >
          <View style={commonStyles.center}>
            <CustomButton
              title={"Category"}
              onPress={() => setCategoryModal(true)}
            />
            <TouchableOpacity
              onPress={() => {
                setAboutTitle("Post Due Date");
                setAboutBody(
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                );
                modalizeRef.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              commonStyles.text,
              profileStyles.profileArea,
              { marginRight: 15 },
            ]}
          >
            {type === "creator"
              ? AREA_OPTIONS_OBJECT[formData.area]
              : AREA_OPTIONS_OBJECT[formData.target_audience]}
          </Text>
        </View>
      </View>

      <View style={commonStyles.centerVertical}>
        <Text>By clicking Register, you agree to our </Text>
        <View style={commonStyles.center}>
          <TouchableOpacity
            onPress={() => {
              setPrivacyModal(true);
            }}
          >
            <Text style={{ fontWeight: "600", color: "blue" }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <Text> and </Text>
          <TouchableOpacity
            onPress={() => {
              setEulaModal(true);
            }}
          >
            <Text style={{ fontWeight: "600", color: "blue" }}>
              End User License Agreement
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={categoryModal} transparent={true} animationType="fade">
        <View style={jobsStyles.modalContainer}>
          <View style={jobsStyles.modalContent}>
            <Text style={jobsStyles.modalTitle}>
              {type === "creator"
                ? "Select your area of expertise"
                : "Select your business category"}
            </Text>
            <Picker
              selectedValue={
                type === "creator" ? formData.area : formData.target_creator
              }
              style={jobsStyles.picker}
              onValueChange={(value) => {
                type === "creator"
                  ? handleChange("area", value)
                  : handleChange("target_audience", value);
                setCategoryModal(false);
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
              onPress={() => setCategoryModal(false)}
            />
          </View>
        </View>
      </Modal>

      {privacyModal && (
        <PrivacyModal
          privacyModal={privacyModal}
          onClose={() => setPrivacyModal(false)}
        />
      )}

      {eulaModal && (
        <EulaModal eulaModal={eulaModal} onClose={() => setEulaModal(false)} />
      )}

      <CustomButton title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default AdditionalInfo;
