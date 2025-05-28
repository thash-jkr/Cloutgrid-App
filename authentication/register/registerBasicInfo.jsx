import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import authStyles from "../../styles/auth";
import CustomButton from "../../common/CustomButton";
import Config from "../../config";
import Loader from "../../common/loading";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BasicInfo = ({ nextStep, formData, handleChange, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  const handleContinue = async () => {
    if (formData.user.password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    } else if (
      !formData.user.name ||
      !formData.user.username ||
      !formData.user.email ||
      !formData.user.password
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

      const response = await axios.post(`${Config.BASE_URL}/otp/send/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 203) {
        Alert.alert("Error", response.data.message);
      }

      if (response.status == 200) {
        nextStep();
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.response?.data?.email[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Loader visible={isLoading} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingVertical: 10,
          position: "absolute",
          top: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={20} />
        </TouchableOpacity>
      </View>
      <Text style={authStyles.h1}>
        Join as a {type === "creator" ? "Creator" : "Business"}
      </Text>
      <TextInput
        style={authStyles.input}
        placeholder="Enter your name:"
        placeholderTextColor="#777"
        value={formData.user.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Enter your Email:"
        placeholderTextColor="#777"
        keyboardType="email-address"
        value={formData.user.email}
        onChangeText={(value) => handleChange("email", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Enter a username:"
        placeholderTextColor="#777"
        value={formData.user.username}
        onChangeText={(value) => handleChange("username", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Choose a strong Password:"
        placeholderTextColor="#777"
        secureTextEntry={true}
        value={formData.user.password}
        onChangeText={(value) => handleChange("password", value)}
      />

      <TextInput
        style={authStyles.input}
        placeholder="Enter the password again:"
        placeholderTextColor="#777"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(value) => handleConfirmPassword(value)}
      />

      <CustomButton title="Continue" onPress={handleContinue} />
    </KeyboardAvoidingView>
  );
};

export default BasicInfo;
