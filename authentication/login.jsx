import {
  View,
  Text,
  Platform,
  Animated,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import LoginBusiness from "./loginBusiness";
import LoginCreator from "./loginCreator";
import authStyles from "../styles/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const Login = () => {
  const [type, setType] = useState("creator");
  const translateX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const animateTransition = (nextType) => {
    Animated.timing(translateX, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setType(nextType);
      translateX.setValue(-width);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <KeyboardAvoidingView
      style={[authStyles.container]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <Animated.View
        style={{
          transform: [{ translateX }],
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <LinearGradient
          colors={["rgba(143, 128, 255, 1) 0%", "rgba(206, 193, 248, 1) 51%"]}
          style={{ margin: 10, borderRadius: 20 }}
        >
          {type === "creator" ? <LoginCreator /> : <LoginBusiness />}
        </LinearGradient>
      </Animated.View>

      <View style={authStyles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={authStyles.footerText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>

      <View style={authStyles.footer}>
        <TouchableOpacity
          onPress={() => {
            type === "creator"
              ? animateTransition("business")
              : animateTransition("creator");
          }}
        >
          {type === "creator" ? (
            <Text style={authStyles.footerText}>
              Not a creator? Business Login
            </Text>
          ) : (
            <Text style={authStyles.footerText}>
              Not a business? Creator Login
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={[authStyles.footer]}>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={authStyles.footerText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
