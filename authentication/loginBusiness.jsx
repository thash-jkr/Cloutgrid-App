import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import authStyles from "../styles/auth";
import CustomButton from "../common/customButton";

import Config from "../config";
import Loader from "../common/loading";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "./authSlice";
import commonStyles from "../styles/common";

const LoginBusiness = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { authLoading, authError } = useSelector((s) => s.auth);

  const handleSubmit = async () => {
    dispatch(loginThunk({ email, password, type: "business" }))
      .unwrap()
      .then(() =>
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "AppTabs" }],
          })
        )
      )
      .catch((error) => {
        Alert.alert("Login Failed", error);
      });
  };

  return (
    <View style={authStyles.loginContainer}>
      <Text style={authStyles.h1}>Business Login</Text>
      <TextInput
        style={[commonStyles.input, { width: "100%" }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor={"#888"}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[commonStyles.input, { width: "100%" }]}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor={"#888"}
        secureTextEntry={true}
      />
      <CustomButton
        title="Login"
        onPress={handleSubmit}
        isLoading={authLoading}
      />
    </View>
  );
};

export default LoginBusiness;
