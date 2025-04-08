import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

import authStyles from "../../styles/auth";
import CustomButton from "../../common/CustomButton";
import Config from "../../config";

const OtpVerification = ({ nextStep, formData, prevStep }) => {
  const [OTP, setOTP] = useState(0);

  const handleOTP = async () => {
    try {
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
      console.log(error);
    }
  };

  return (
    <View style={authStyles.container}>
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
