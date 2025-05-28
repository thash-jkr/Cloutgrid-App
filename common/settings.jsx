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
import React, { useEffect, useState } from "react";
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
  faWarning,
  faArrowLeft,
  faHandshakeSimple,
} from "@fortawesome/free-solid-svg-icons";

import Config from "../config";
import jobsStyles from "../styles/jobs";
import authStyles from "../styles/auth";
import profileStyles from "../styles/profile";
import CustomButton from "./CustomButton";
import commonStyles from "../styles/common";
import { useDispatch, useSelector } from "react-redux";
import { logoutLocal, logoutThunk } from "../authentication/authSlice";
import { clearFeed } from "../slices/feedSlice";
import { clearNotifications } from "../slices/notificationSlice";
import { clearProfile } from "../slices/profileSlice";
import { clearProfiles } from "../slices/profilesSlice";
import { clearJobs } from "../slices/jobSlice";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [help, setHelp] = useState("");
  const [feedback, setFeedback] = useState("");
  const [eulaModal, setEulaModal] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { token, type } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        dispatch(clearFeed());
        dispatch(clearNotifications());
        dispatch(clearProfile());
        dispatch(clearProfiles());
        dispatch(clearJobs());
      })
      .catch((error) => Alert.alert("Error", "Logout Failed - " + error));
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${Config.BASE_URL}/delete/${type}/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.status === 200) {
                await SecureStore.deleteItemAsync("access");
                await SecureStore.deleteItemAsync("refresh");
                await SecureStore.deleteItemAsync("type");
                await SecureStore.deleteItemAsync("user");
                dispatch(logoutLocal());
              }
            } catch (error) {
              dispatch(logoutLocal);
              console.error("Logout Error", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={profileStyles.settings}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: 20,
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={commonStyles.center}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            style={{ marginRight: 20 }}
          />
          <Text style={commonStyles.backText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
          onPress={() => setEulaModal(true)}
        >
          <FontAwesomeIcon icon={faHandshakeSimple} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            EULA
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
        <TouchableOpacity style={jobsStyles.job} onPress={handleDelete}>
          <FontAwesomeIcon icon={faWarning} size={25} />
          <Text style={{ fontSize: 20, padding: 5, fontFamily: "sen-500" }}>
            Delete Account
          </Text>
        </TouchableOpacity>
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
                Last Updated: May 28, 2025
              </Text>

              <Text style={{ marginBottom: 16 }}>
                Cloutgrid, developed and operated by Cloutivity Private Limited,
                is committed to protecting the privacy of all individuals who
                use our mobile application and web platform. This Privacy Policy
                explains how we collect, use, and safeguard personal data, as
                well as your rights in relation to this data. By accessing or
                using Cloutgrid, you consent to the practices described herein.
                This policy applies to all users, including Creator Users and
                Business Users.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Platform Purpose
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid is a digital platform for collaboration between
                Creator Users and Business Users. Creators share their work and
                talents through content, while Businesses post collaboration
                opportunities, campaigns, and jobs. We are committed to
                protecting user data and enforcing standards for respectful
                engagement.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Data Collection
              </Text>
              <Text style={{ marginBottom: 16 }}>
                When registering, we collect your name and email address for
                account creation, communication, and recovery. You may upload
                profile images, posts, or media that become part of your public
                profile. A unique ID is assigned to each account to ensure a
                seamless experience.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Usage Data
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We collect non-identifiable information such as device model, OS
                version, screen size, usage patterns, and general location
                (e.g., city-level IP). This helps us enhance app performance and
                security.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                User Content & Moderation
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid relies on user-generated content and enforces strict
                content standards to maintain a respectful and safe environment.
                We do not tolerate any content that includes nudity, sexually
                explicit material, hate speech, harassment, or graphic violence.
                Such violations will result in immediate and permanent account
                suspension. Our moderation process includes a combination of
                automated tools and manual review. Users are encouraged to
                report inappropriate content or behavior, which will be reviewed
                promptly. Repeated or severe violations will result in permanent
                removal from the platform.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Community Standards
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Creators must upload only original or licensed content and
                behave respectfully. Businesses must post only legitimate,
                non-discriminatory opportunities. All users must follow the
                Community Guidelines and EULA.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Data Usage
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Personal data is used to manage accounts, deliver services,
                enable communication, and ensure platform safety. We do not use
                personal data for targeted ads or sell it to third parties. If
                shared with providers (e.g., cloud, analytics), it is solely for
                platform functionality under strict agreements.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Data Retention
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We retain data only as long as necessary to provide services or
                fulfill legal obligations. You can delete your account via
                settings or by contacting us. Data is permanently deleted unless
                legally required.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Security
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We implement encryption, access controls, and secure
                environments. Still, no system is 100% secure. Use strong
                passwords and be mindful of public information.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Children’s Privacy
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid is not intended for children under 13. If you believe
                a child has submitted personal data, please contact us and we
                will remove it.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Your Rights
              </Text>
              <Text style={{ marginBottom: 16 }}>
                You may view, update, delete your data, or request a copy. You
                may also object to inappropriate data use. Contact us to
                exercise your rights.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Policy Updates
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We may update this Privacy Policy. Significant changes will be
                communicated via in-app or email. Continued use after updates
                indicates acceptance.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                Contact Us
              </Text>
              <Text style={{ marginBottom: 32 }}>
                Cloutivity Private Limited{"\n"}Email: info@cloutgrid.com
                {"\n\n"}
                By using Cloutgrid, you agree to this Privacy Policy. Thank you
                for supporting a safe and creative community.
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

      <Modal visible={eulaModal} transparent={true} animationType="fade">
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>
              End User License Agreement (EULA)
            </Text>
            <ScrollView style={{ padding: 10, maxHeight: 400 }}>
              <Text style={{ fontStyle: "italic", marginBottom: 16 }}>
                Effective Date: May 28, 2025
              </Text>

              <Text style={{ marginBottom: 16 }}>
                IMPORTANT: PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING
                CLOUTGRID. BY CREATING AN ACCOUNT OR ACCESSING THE APP, YOU
                AGREE TO BE BOUND BY THE TERMS OF THIS AGREEMENT. IF YOU DO NOT
                AGREE, DO NOT USE THE APP.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                1. License Grant
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutivity Private Limited ("Company", "we", "our") grants you
                ("User", "you") a limited, non-exclusive, non-transferable,
                revocable license to use Cloutgrid for your personal or business
                use in accordance with this Agreement.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                2. Ownership
              </Text>
              <Text style={{ marginBottom: 16 }}>
                All content, code, and data within Cloutgrid remain the
                exclusive property of Cloutivity Private Limited. You are
                granted a license to use Cloutgrid but not ownership of any of
                its components.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                3. User-Generated Content
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid allows users to upload content such as posts,
                comments, messages, and profile details ("User Content"). By
                submitting User Content, you agree to the following:
                {"\n"}- You are solely responsible for all content you post or
                share.
                {"\n"}- You will not submit any content that is abusive,
                threatening, discriminatory, harassing, defamatory, obscene,
                illegal, or otherwise objectionable.
                {"\n"}- You grant Cloutivity Private Limited a non-exclusive,
                worldwide, royalty-free license to use, host, store, display,
                and distribute your User Content for the purpose of operating
                and improving the platform.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                4. Community Standards & No Tolerance Policy
              </Text>
              <Text style={{ marginBottom: 16 }}>
                By using Cloutgrid, you agree to:
                {"\n"}- Abide by our Community Guidelines, which prohibit hate
                speech, explicit content, impersonation, spam, harassment, and
                abusive behavior.
                {"\n"}- Understand that Cloutgrid enforces a zero-tolerance
                policy toward objectionable content or abusive users.
                {"\n"}- Not exploit, manipulate, or interfere with the platform
                or other users.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                5. Moderation & Reporting
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid includes the following content moderation systems:
                {"\n"}- Automated and manual filtering of objectionable content.
                {"\n"}- Flagging mechanism allowing users to report content or
                behavior that violates community guidelines.
                {"\n"}- Review and enforcement, where reported content may be
                reviewed, removed, and action taken against violators, including
                warnings, suspensions, or permanent bans.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                6. Account Termination
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid reserves the right to suspend or terminate your
                account without prior notice if you violate this EULA, engage in
                abusive behavior, or post objectionable content.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                7. Disclaimer & Limitation of Liability
              </Text>
              <Text style={{ marginBottom: 16 }}>
                Cloutgrid is provided “as is.” We do not guarantee that it will
                be error-free or uninterrupted. To the maximum extent permitted
                by law, Cloutivity Private Limited disclaims all liability for
                damages arising from your use of the app, including loss of
                data, profits, or exposure to objectionable content.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                8. Updates and Modifications
              </Text>
              <Text style={{ marginBottom: 16 }}>
                We may update this EULA from time to time. Continued use of
                Cloutgrid after such changes constitutes your acceptance of the
                revised terms.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                9. Governing Law
              </Text>
              <Text style={{ marginBottom: 16 }}>
                This Agreement shall be governed by and construed in accordance
                with the laws of India, without regard to its conflict of law
                principles.
              </Text>

              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}
              >
                10. Contact
              </Text>
              <Text style={{ marginBottom: 32 }}>
                For questions or concerns, contact:
                {"\n"}Email: info@cloutgrid.com
              </Text>
            </ScrollView>
            <CustomButton title={"Close"} onPress={() => setEulaModal(false)} />
          </View>
        </View>
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
