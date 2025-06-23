import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import authStyles from "../styles/auth";
import CustomButton from "../common/customButton";
import Config from "../config";
import Loader from "../common/loading";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "./authSlice";

const LoginCreator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { status, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (status === "succeeded") {
      setIsLoading(false)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "AppTabs" }],
        })
      );
    } else if (status === "failed") {
      setIsLoading(false)
      Alert.alert("Login Failed", error)
    }
  }, [status, navigation]);

  const handleSubmit = async () => {
    setIsLoading(true)
    const type = "creator";
    dispatch(loginThunk({ email, password, type }));
  };

  return (
    <View style={authStyles.loginContainer}>
      <Loader visible={isLoading} />
      <Text style={authStyles.h1}>Creator Login</Text>
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
      <CustomButton
        title={isLoading ? "Loading" : "Login"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
};

export default LoginCreator;
