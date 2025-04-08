import { View, Text, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import authStyles from "../styles/auth";
import CustomButton from "../common/CustomButton";
import Config from "../config";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${Config.BASE_URL}/password-reset/`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Password reset link sent to your email");
      }

      navigation.navigate("Register");
    } catch (error) {
      Alert.alert("An error occurred, please try again");
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.h1}>Reset your password</Text>
      <View style={authStyles.loginContainer}>
        <Text style={authStyles.h3}>
          Enter your email address and we will send you a link to reset your
          password
        </Text>
        <View>
          <TextInput
            style={authStyles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
          />
        </View>
        <CustomButton title="Send Reset Link" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default ResetPassword;
