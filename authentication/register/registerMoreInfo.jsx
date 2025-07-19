import {
  Text,
  View,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import React, { useState, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import CustomButton from "../../common/customButton";
import PrivacyModal from "../../modals/privacyModal";
import profileStyles from "../../styles/profile";
import AboutModal from "../../modals/aboutModal";
import commonStyles from "../../styles/common";
import EulaModal from "../../modals/eulaModal";
import jobsStyles from "../../styles/jobs";
import Loader from "../../common/loading";
import Config from "../../config";
import PickerModal from "../../modals/pickerModal";

const { width } = Dimensions.get("window");

const AdditionalInfo = ({ formData, handleChange, prevStep, type }) => {
  const [categoryModal, setCategoryModal] = useState(false);
  const [pickerModal, setPickerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [eulaModal, setEulaModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aboutContent, setAboutContent] = useState({
    title: "",
    body: "",
  });

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const aboutModalize = useRef(null);

  const handleSubmit = async () => {
    try {
      if (formData.user.password !== confirmPassword) {
        Alert.alert("Error", "Passwords must match!");
        return;
      } else if (!formData.user.password) {
        Alert.alert("Error", "Please choose a password!");
        return;
      } else if (
        (type === "creator" && !formData.area) ||
        (type === "business" && !formData.target_audience)
      ) {
        Alert.alert("Error", "Please select your category");
        return;
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
                  body: "Choose a strong password to keep your account secure. Use at least 8 characters with a mix of letters, numbers, or symbols.",
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
            placeholderTextColor={"#888"}
            secureTextEntry={true}
          />
        </View>

        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Confirm Password: </Text>
          </View>
          <TextInput
            placeholder="Enter the password again"
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            style={commonStyles.input}
            placeholderTextColor={"#888"}
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
              onPress={() => setPickerModal(true)}
            />
            <TouchableOpacity
              onPress={() => {
                setAboutContent({
                  title: "Your area of expertise",
                  body:
                    type === "creator"
                      ? "Select the area that best represents your content or expertise. This helps businesses discover you based on relevant campaigns and collaborations."
                      : "Pick the category that best describes your business or brand. This helps you reach the right creators and audience when posting job collaborations.",
                });
                aboutModalize.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              commonStyles.text,
              profileStyles.profileArea,
              commonStyles.center,
              { marginRight: 15, fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            {type === "creator"
              ? AREA_OPTIONS_OBJECT[formData.area]
              : AREA_OPTIONS_OBJECT[formData.target_audience]}
          </Text>
        </View>
      </View>

      <View style={commonStyles.centerVertical}>
        <Text style={{ fontFamily: "Poppins_500Medium" }}>
          By clicking Register, you agree to our{" "}
        </Text>
        <View style={commonStyles.center}>
          <TouchableOpacity
            onPress={() => {
              setPrivacyModal(true);
            }}
          >
            <Text style={{ color: "blue", fontFamily: "Poppins_500Medium" }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: "Poppins_500Medium" }}> and </Text>
          <TouchableOpacity
            onPress={() => {
              setEulaModal(true);
            }}
          >
            <Text style={{ color: "blue", fontFamily: "Poppins_500Medium" }}>
              End User License Agreement
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomButton title="Register" onPress={handleSubmit} />

      {pickerModal && (
        <PickerModal
          pickerModal={pickerModal}
          onClose={() => setPickerModal(false)}
          category={
            type === "creator" ? formData.area : formData.target_audience
          }
          handleChange={handleChange}
          type={type}
        />
      )}

      {privacyModal && (
        <PrivacyModal
          privacyModal={privacyModal}
          onClose={() => setPrivacyModal(false)}
        />
      )}

      {eulaModal && (
        <EulaModal eulaModal={eulaModal} onClose={() => setEulaModal(false)} />
      )}

      <AboutModal
        modalizeRef={aboutModalize}
        title={aboutContent.title}
        body={aboutContent.body}
      />
    </View>
  );
};

export default AdditionalInfo;
