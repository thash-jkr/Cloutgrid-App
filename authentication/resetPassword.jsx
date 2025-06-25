import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import authStyles from "../styles/auth";
import CustomButton from "../common/customButton";
import Config from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import commonStyles from "../styles/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

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
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
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
          <Text style={commonStyles.backText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <View style={authStyles.loginContainer}>
        <Text style={[commonStyles.h4, {"marginBottom": 20}]}>
          Enter your email address and we will send you a link to reset your
          password
        </Text>
        <View>
          <TextInput
            style={commonStyles.input}
            placeholder="Email"
            placeholderTextColor={"#888"}
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
