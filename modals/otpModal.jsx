import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from "react-native";
import React, { useState } from "react";
import CustomButton from "../common/customButton";
import commonStyles from "../styles/common";
import authStyles from "../styles/auth";

const OTPModal = ({ showOTPModal, onClose, onSubmit, OTP, setOTP, isLoading }) => {

  return (
    <Modal visible={showOTPModal} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        style={commonStyles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={commonStyles.modalContent}>
          <Text style={commonStyles.modalHeaderText}>OTP Verification</Text>

          <Text style={{ marginVertical: 10 }}>
            Please enter the OTP sent to your email.
          </Text>

          <TextInput
            style={authStyles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={OTP}
            onChangeText={(value) => setOTP(value)}
          />
          <View style={commonStyles.center}>
            <CustomButton title={"Close"} onPress={onClose} />
            <CustomButton title={isLoading ? "Loading..." : "Submit"} onPress={onSubmit} disabled={!OTP || isLoading}/>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default OTPModal;
