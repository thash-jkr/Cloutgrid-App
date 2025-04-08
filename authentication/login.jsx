import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import authStyles from "../styles/auth";
import LoginCreator from "./loginCreator";
import LoginBusiness from "./loginBusiness";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Login = () => {
  const [type, setType] = useState("creator");
  const translateX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

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
    <View style={authStyles.container}>
      <Animated.View
        style={{
          transform: [{ translateX }],
          margin: 10,
          borderRadius: 20,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ADE8F4",
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        {type === "creator" ? <LoginCreator /> : <LoginBusiness />}
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
      <View style={authStyles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={authStyles.footerText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
