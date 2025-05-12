import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserPlus,
  faLifeRing,
  faCircleInfo,
  faFileContract,
  faComments,
  faArrowRightFromBracket,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import Config from "../config";
import jobsStyles from "../styles/jobs";
import authStyles from "../styles/auth";
import profileStyles from "../styles/profile";
import CustomButton from "./CustomButton";
import commonStyles from "../styles/common";

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [help, setHelp] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");
      const access = await SecureStore.getItemAsync("access");
      if (!refresh) {
        console.log("No refresh token found");
        return;
      }

      await axios.post(
        `${Config.BASE_URL}/logout/`,
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      await SecureStore.deleteItemAsync("access");
      await SecureStore.deleteItemAsync("refresh");
      axios.defaults.headers.common["Authorization"] = null;
      await Updates.reloadAsync();
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <SafeAreaView style={profileStyles.settings}>
      <Text style={profileStyles.h1}>Settings</Text>
      <View style={profileStyles.settingsButtons}>
        {/* <TouchableOpacity style={jobsStyles.job}>
          <FontAwesomeIcon icon={faUserPlus} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Follow & Invite
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setHelpModal(true)}
        >
          <FontAwesomeIcon icon={faLifeRing} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Help
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setAboutModal(true)}
        >
          <FontAwesomeIcon icon={faCircleInfo} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setPrivacyModal(true)}
        >
          <FontAwesomeIcon icon={faFileContract} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setFeedbackModal(true)}
        >
          <FontAwesomeIcon icon={faComments} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Feedback
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={jobsStyles.job}
          onPress={() => setShowPasswordModal(true)}
        >
          <FontAwesomeIcon icon={faLock} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Change Password
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={jobsStyles.job} onPress={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={helpModal} transparent={true} animationType="fade">
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Need Assistance?</Text>
            <TextInput
              style={[authStyles.input, { height: 200 }]}
              placeholder={
                "Use this form to reach out to our team for any questions, issues, or guidance you need while using Cloutgrid. Whether you're facing a technical hiccup or just need support, we’re here to help."
              }
              placeholderTextColor={"#999"}
              textAlign="justify"
              value={help}
              onChangeText={(value) => setHelp(value)}
              multiline
            />
            <View style={commonStyles.center}>
              <CustomButton
                title={"Close"}
                onPress={() => setHelpModal(false)}
              />
              <CustomButton
                title={"Submit"}
                disabled={help.length < 1}
                onPress={() => {
                  setHelp("");
                  setHelpModal(false);
                  Alert.alert(
                    "Request Received",
                    "Thank you for reaching out. Our support team has received your message and will get back to you shortly"
                  );
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={aboutModal} transparent={true} animationType="fade">
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>About Us</Text>
            <Text style={{ textAlign: "justify" }}>
              Cloutgrid is where creativity meets opportunity. Built for the
              modern digital era, our platform bridges the gap between content
              creators and businesses, making collaborations smoother, smarter,
              and more impactful.
            </Text>
            <Text></Text>
            <Text style={{ textAlign: "justify" }}>
              Whether you're a creator looking to showcase your influence or a
              brand aiming to promote your product through authentic voices,
              Cloutgrid helps you connect, collaborate, and grow. With tools to
              display insights, apply for partnerships, and manage campaigns —
              Cloutgrid empowers you to build your network and your brand, all
              in one place.
            </Text>
            <CustomButton
              title={"Close"}
              onPress={() => setAboutModal(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={privacyModal} transparent={true} animationType="fade">
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Privacy Policy</Text>
            <ScrollView style={{ padding: 10, maxHeight: 400 }}>
              <Text style={{ fontStyle: "italic", marginBottom: 16 }}>
                Last updated: May 09, 2025
              </Text>

              <Text style={{ marginBottom: 16 }}>
                This Privacy Policy describes our policies and procedures on the
                collection, use, and disclosure of your information when you use
                the Cloutgrid app (“the Service”) and tells you about your
                privacy rights and how the law protects you. By using the
                Service, you agree to the collection and use of information in
                accordance with this Privacy Policy.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Summary of Data Collection
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid collects the following data types, which are linked to
                your identity and used solely for the app’s functionality:
                {"\n"}- Name – used for your profile and display to other users
                {"\n"}- Email address – used for account login, communication,
                and account recovery
                {"\n"}- Photos or videos – used for posting content and
                customizing your profile
                {"\n"}- User ID – used to identify your account and provide
                personalized functionality
                {"\n\n"}We do not use your data for tracking, targeted
                advertising, or data brokering.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Interpretation and Definitions
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Application refers to Cloutgrid, the software application
                provided by CLOUTIVITY PRIVATE LIMITED.{"\n"}
                Company refers to CLOUTIVITY PRIVATE LIMITED, Kerala, India.{"\n"}
                Personal Data means information relating to an identified or
                identifiable individual.{"\n"}
                Service refers to the Application.{"\n"}
                You means the individual accessing or using the Service.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Types of Data Collected
              </Text>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Personal Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                The following personal data is collected and linked to your
                identity:
                {"\n"}- Name
                {"\n"}- Email address
                {"\n"}- Photos or videos you upload
                {"\n"}- User ID or account identifier
              </Text>

              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Usage Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Usage data may include information such as device type,
                operating system, screen size, and app usage metrics. This helps
                us improve the performance and security of the Service.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Use of Your Personal Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We use the data we collect to provide and maintain the Service,
                manage your account, enable features like profile creation and
                content posting, respond to support needs, and improve app
                performance.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Sharing Your Personal Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We may share your data with trusted service providers, during
                business transfers, or when legally required. Your data will
                never be sold for advertising or marketing purposes.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Data Retention
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Your data is retained only for as long as necessary to provide
                our services or comply with legal requirements.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Security
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We follow industry-standard practices to protect your data, but
                no method of storage or transmission is 100% secure.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Children’s Privacy
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Our Service is not intended for users under the age of 13. If
                you believe your child has provided us with data, please contact
                us immediately.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Your Rights
              </Text>
              <Text style={{ marginBottom: 16 }}>
                You may view, update, or request deletion of your personal data
                from your account settings or by contacting us.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Changes to This Privacy Policy
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We may update this policy and will notify you of significant
                changes via email or in-app alerts.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Contact Us
              </Text>
              <Text style={{ marginBottom: 32 }}>
                If you have any questions, please contact us at:
                {"\n"}Email: info@cloutgrid.com
              </Text>
            </ScrollView>
            <CustomButton
              title={"Close"}
              onPress={() => setPrivacyModal(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={feedbackModal} transparent={true} animationType="fade">
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>We value your thoughts</Text>
            <TextInput
              style={[authStyles.input, { height: 200 }]}
              placeholder={
                "Share your experience, suggestions, or ideas to help us improve Cloutgrid. Your feedback plays a key role in shaping a better platform for everyone"
              }
              placeholderTextColor={"#999"}
              textAlign="justify"
              value={feedback}
              onChangeText={(value) => setFeedback(value)}
              multiline
            />
            <View style={commonStyles.center}>
              <CustomButton
                title={"Close"}
                onPress={() => setFeedbackModal(false)}
              />
              <CustomButton
                title={"Submit"}
                disabled={feedback.length < 1}
                onPress={() => {
                  setFeedback("");
                  setFeedbackModal(false);
                  Alert.alert(
                    "Thanks for the Feedback",
                    "We appreciate you taking the time to share your thoughts. Your feedback helps us improve Cloutgrid"
                  );
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Change Password</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Enter your current password"
            />
            <TextInput
              style={authStyles.input}
              placeholder="Enter the new password"
            />
            <TextInput
              style={authStyles.input}
              placeholder="Enter new password again"
            />
            <View style={profileStyles.button}>
              <CustomButton
                title={"Close"}
                onPress={() => setShowPasswordModal(false)}
              />
              <CustomButton title="Save" onPress={() => {}} />
            </View>
          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

export default Settings;
