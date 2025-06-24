import {
  Text,
  View,
  Alert,
  Platform,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import CustomButton from "../../common/customButton";
import AboutModal from "../../modals/aboutModal";
import commonStyles from "../../styles/common";
import OTPModal from "../../modals/otpModal";
import Config from "../../config";

const BasicInfo = ({ nextStep, formData, handleChange, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aboutContent, setAboutContent] = useState({
    title: "",
    body: "",
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [OTP, setOTP] = useState(null);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const aboutModalize = useRef(null);

  const handleContinue = async () => {
    if (
      !formData.user.name ||
      !formData.user.username ||
      !formData.user.email
    ) {
      Alert.alert("Error", "Please complete all the fields");
      return;
    }

    try {
      setIsLoading(true);
      const data = new FormData();
      data.append("name", formData.user.name);
      data.append("username", formData.user.username);
      data.append("email", formData.user.email);

      const response = await axios.post(`${Config.BASE_URL}/otp/send/`, data);

      if (response.status === 203) {
        Alert.alert("Error", response.data.message);
      }

      if (response.status === 200) {
        setShowOTPModal(true);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || error.response?.data?.email[0]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTP = async () => {
    try {
      setIsLoading(true);
      const data = new FormData();
      data.append("username", formData.user.username);
      data.append("otp", OTP);

      const response = await axios.post(
        `${Config.BASE_URL}/otp/verify/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Message", response.data.message);

      if (response.status == 200) {
        setShowOTPModal(false);
        nextStep();
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoOTP = async () => {
    try {
      setShowOTPModal(false);
      setIsLoading(true);
      nextStep();
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Text style={commonStyles.backText}>
            {type === "creator" ? "Creator" : "Business"} Registration
          </Text>
        </TouchableOpacity>
      </View>

      <View style={commonStyles.centerVertical}>
        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Name: </Text>
          </View>

          <TextInput
            placeholder="Enter your name"
            value={formData.user.name}
            onChangeText={(value) => handleChange("name", value)}
            style={commonStyles.input}
            placeholderTextColor={"#999"}
          />
        </View>

        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Email: </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutContent({
                  title: "Email Address",
                  body: "This email will be used to verify your account and help you log in securely. Make sure to enter an email you actively use",
                });
                aboutModalize.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter your Email"
            value={formData.user.email}
            onChangeText={(value) => handleChange("email", value)}
            style={commonStyles.input}
            placeholderTextColor={"#999"}
          />
        </View>

        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Username: </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutContent({
                  title: "Username",
                  body: "Your username is your unique identifier on Cloutgrid. It will appear in your profile URL and can be used by others to search and mention you. \nChoose wisely — you can’t change it later.",
                });
                aboutModalize.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter a username"
            value={formData.user.username}
            onChangeText={(value) => handleChange("username", value)}
            style={commonStyles.input}
            placeholderTextColor={"#999"}
          />
        </View>

        <CustomButton
          title={isLoading ? "Loading..." : "Continue"}
          onPress={handleContinue}
          disabled={isLoading}
        />
      </View>

      <AboutModal
        modalizeRef={aboutModalize}
        title={aboutContent.title}
        body={aboutContent.body}
      />

      {showOTPModal && (
        <OTPModal
          showOTPModal={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onSubmit={handleOTP}
          OTP={OTP}
          setOTP={setOTP}
          isLoading={isLoading}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default BasicInfo;
