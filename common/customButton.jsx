import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import commonStyles from "../styles/common";

const CustomButton = ({ title, onPress, disabled, isLoading }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={1}
      style={[
        styles.button,
        isPressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        isLoading && styles.buttonDisabled,
      ]}
    >
      <View style={commonStyles.center} allowFontScaling={false}>
        <Text style={styles.buttonText}>{title}</Text>
        {isLoading && <ActivityIndicator style={{ marginLeft: 3 }} />}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgb(23 37 84)",
    borderRadius: 19,
    height: 38,
    paddingHorizontal: 15,
    textAlign: "center",
    justifyContent: "center",
    margin: 10,
  },
  buttonText: {
    color: "#ECEEEA",
    fontSize: 14,
    fontWeight: 600
  },
  buttonPressed: {
    backgroundColor: "#023E8A",
  },
  buttonDisabled: {
    backgroundColor: "#023E8A",
    color: "#ECEEEA",
  },
});
