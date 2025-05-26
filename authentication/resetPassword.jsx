import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import authStyles from "../styles/auth";
import CustomButton from "../common/CustomButton";
import Config from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: 20,
          padding: 10,
          position: "absolute",
          top: 50
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
