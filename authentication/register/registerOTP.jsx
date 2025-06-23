import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

import authStyles from "../../styles/auth";
import CustomButton from "../../common/customButton";
import Config from "../../config";
import Loader from "../../common/loading";

const OtpVerification = ({ nextStep, formData, prevStep }) => {
  const [OTP, setOTP] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
        nextStep();
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoOTP = async () => {
    try {
      setIsLoading(true);
      nextStep();
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <Loader visible={isLoading} />
      <Text style={authStyles.h1}>OTP Verification</Text>

      <Text style={{ marginBottom: 20 }}>
        Please enter the OTP sent to your email.
      </Text>

      <TextInput
        style={authStyles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={OTP}
        onChangeText={(value) => setOTP(value)}
      />

      <View style={{ flexDirection: "row" }}>
        <CustomButton title="Go Back" onPress={prevStep} />
        <CustomButton title="Continue" onPress={handleOTP} />
      </View>
    </View>
  );
};

export default OtpVerification;
