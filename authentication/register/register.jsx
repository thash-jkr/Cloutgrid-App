import { Text, Animated, StatusBar, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";

import authStyles from "../../styles/auth";
import homeStyles from "../../styles/home";

const SignUp = () => {
  const navigration = useNavigation();
  const creatorArrowPosition = useRef(new Animated.Value(0)).current;
  const businessArrowPosition = useRef(new Animated.Value(0)).current;
  const loginArrowPosition = useRef(new Animated.Value(0)).current;

  const creatorHandlePressIn = () => {
    Animated.timing(creatorArrowPosition, {
      toValue: 30,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const creatorHandlePressOut = () => {
    Animated.timing(creatorArrowPosition, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const businessHandlePressIn = () => {
    Animated.timing(businessArrowPosition, {
      toValue: 30,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const businessHandlePressOut = () => {
    Animated.timing(businessArrowPosition, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const loginHandlePressIn = () => {
    Animated.timing(loginArrowPosition, {
      toValue: 30,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const loginHandlePressOut = () => {
    Animated.timing(loginArrowPosition, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
      <Text style={authStyles.h1}>
        Join{" "}
        <Text
          style={{ color: "rgb(23 37 84)", fontFamily: "Poppins_700Bold" }}
        >
          CLOUT
        </Text>
        <Text style={homeStyles.logoSide}>Grid</Text>
      </Text>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={creatorHandlePressIn}
        onPressOut={creatorHandlePressOut}
        onPress={() => navigration.navigate("RegisterCreator")}
      >
        <LinearGradient
          colors={["rgba(143, 128, 255, 1) 0%", "rgba(206, 193, 248, 1) 51%"]}
          style={authStyles.card}
        >
          <Text style={authStyles.h2}>Creator</Text>
          <Animated.View
            style={{ transform: [{ translateX: creatorArrowPosition }] }}
          >
            <FontAwesomeIcon icon={faArrowRight} size={17} />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={businessHandlePressIn}
        onPressOut={businessHandlePressOut}
        onPress={() => navigration.navigate("RegisterBusiness")}
      >
        <LinearGradient
          colors={["rgba(143, 128, 255, 1) 0%", "rgba(206, 193, 248, 1) 51%"]}
          style={authStyles.card}
        >
          <Text style={authStyles.h2}>Business</Text>
          <Animated.View
            style={{ transform: [{ translateX: businessArrowPosition }] }}
          >
            <FontAwesomeIcon icon={faArrowRight} size={17} />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigration.navigate("Login")}
        style={authStyles.footer}
        onPressIn={loginHandlePressIn}
        onPressOut={loginHandlePressOut}
      >
        <Text style={authStyles.footerText}>
          Already have an account? Login
        </Text>
        <Animated.View
          style={{ transform: [{ translateX: loginArrowPosition }] }}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUp;
