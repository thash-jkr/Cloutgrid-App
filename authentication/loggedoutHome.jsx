import React, { useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  Text,
  View,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../common/CustomButton";
import homeStyles from "../styles/home";
import kid from "../assets/—Pngtree—blogger review concept vetor creative_7689749.png";
import logo from "../assets/logo_sample.png";

const LoggedOutHome = () => {
  const navigation = useNavigation();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={homeStyles.home}>
      <StatusBar backgroundColor="#fff" />
      <Text style={homeStyles.logo}>
        Clout<Text style={homeStyles.logoSide}>Grid</Text>
        {/* <Image source={logo} style={homeStyles.logoImage} /> */}
        {/* <Animated.View
          style={{
            transform: [{ rotate }],
            marginLeft: 30,
          }}
        >
          <Image source={logo} style={homeStyles.logoImage} />
        </Animated.View> */}
      </Text>
      <View style={homeStyles.split}>
        <Image source={kid} style={homeStyles.kid} />
        <View style={homeStyles.ccc}>
          <Text style={homeStyles.h2}>Connect</Text>
          <Text style={homeStyles.h2}>Collaborate</Text>
          <Text style={homeStyles.h2}>Create</Text>
        </View>
      </View>
      <CustomButton
        title="Get Started"
        onPress={() => navigation.navigate("Register")}
      />
    </SafeAreaView>
  );
};

export default LoggedOutHome;
