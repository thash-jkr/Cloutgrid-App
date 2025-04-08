import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import authStyles from "../styles/auth";
import CustomButton from "../common/CustomButton";
import Config from "../config";
import Loader from "../common/loading";

const LoginCreator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${Config.BASE_URL}/login/creator/`,
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
      Alert.alert("Login Failed", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={authStyles.loginContainer}>
      <Loader visible={isLoading}/>
      <Text style={authStyles.h1}>Creator Login</Text>
      <TextInput
        style={[authStyles.input, { width: "95%" }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[authStyles.input, { width: "95%" }]}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <CustomButton
        title={isLoading ? "Loading" : "Login"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
};

export default LoginCreator;
