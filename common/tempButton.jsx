import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress, disabled }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={1}
      style={[
        styles.button,
        isPressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonText} allowFontScaling={false}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#03045E",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: "center",
    justifyContent: "center",
    shadowColor: "rgba(166, 175, 195, 0.25)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    margin: 10,
  },
  buttonText: {
    color: "#ECEEEA",
    fontWeight: "700",
    fontSize: 14,
    // fontFamily: "sen-500",
  },
  buttonPressed: {
    backgroundColor: "#023E8A",
  },
  buttonDisabled: {
    backgroundColor: "#023E8A",
    color: "#ECEEEA",
  },
});
