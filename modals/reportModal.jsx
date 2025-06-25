import {
  View,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from "react-native";
import React from "react";
import commonStyles from "../styles/common";
import CustomButton from "../common/customButton";

const ReportModal = ({ reportModal, report, setReport, onClose, body }) => {
  return (
    <Modal visible={reportModal} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        style={commonStyles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={commonStyles.modalContent}>
          <Text style={commonStyles.h1}>Report Form</Text>
          <TextInput
            style={commonStyles.inputLargest}
            placeholder={body}
            placeholderTextColor={"#999"}
            textAlign="justify"
            value={report}
            onChangeText={(value) => setReport(value)}
            textAlignVertical="top"
            multiline
          />

          <View style={commonStyles.center}>
            <CustomButton title={"Close"} onPress={onClose} />
            <CustomButton
              title={"Submit"}
              disabled={report.length < 1}
              onPress={() => {
                setReport("");
                Alert.alert(
                  "Request Received",
                  "Thank you for reaching out. Our support team has received your message and will take necessary actions"
                );
                onClose();
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportModal;
