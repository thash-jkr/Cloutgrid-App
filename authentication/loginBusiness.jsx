import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import authStyles from "../styles/auth";
import CustomButton from "../common/CustomButton";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import Config from "../config";

const LoginCreator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${Config.BASE_URL}/login/business/`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        await SecureStore.setItemAsync("access", response.data.access);
        await SecureStore.setItemAsync("refresh", response.data.refresh);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "AppTabs" }],
          })
        );
      } else {
        Alert.alert("Login Failed", "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error: ", error);
      Alert.alert("Login Failed", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={authStyles.loginContainer}>
      <Text style={authStyles.h1}>Business Login</Text>
      <TextInput
        style={[authStyles.input, { width: "95%" }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor={"#888"}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[authStyles.input, { width: "95%" }]}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor={"#888"}
        secureTextEntry={true}
      />
      <CustomButton title="Login" onPress={handleSubmit} />
    </View>
  );
};

export default LoginCreator;
