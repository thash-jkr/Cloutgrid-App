import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

import authStyles from "../../styles/auth";
import CustomButton from "../../common/CustomButton";
import Config from "../../config";
import Loader from "../../common/loading";
import commonStyles from "../../styles/common";
import jobsStyles from "../../styles/jobs";
import profileStyles from "../../styles/profile";

const { height, width } = Dimensions.get("window");

const AdditionalInfo = ({ formData, setFormData, handleChange, type }) => {
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState(null);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [eulaModal, setEulaModal] = useState(false);

  const navigation = useNavigation();

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      const localUri = result.assets[0]["uri"];
      const fileName = localUri.split("/").pop();
      setFilename(fileName);
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error("Failed to load image"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", localUri, true);
        xhr.send(null);
      });

      setFormData((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          profile_photo: {
            uri: localUri,
            name: fileName,
            type: fileType,
            file: blob,
          },
        },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = new FormData();
      data.append("user.name", formData.user.name);
      data.append("user.email", formData.user.email);
      data.append("user.username", formData.user.username);
      data.append("user.password", formData.user.password);
      data.append("user.bio", formData.user.bio);

      if (type === "creator") {
        data.append("area", formData.area);
      } else {
        data.append("website", formData.website);
        data.append("target_audience", formData.target_audience);
      }

      if (formData.user.profile_photo) {
        data.append("user.profile_photo", {
          uri: formData.user.profile_photo.uri,
          name: formData.user.profile_photo.name,
          type: formData.user.profile_photo.type,
        });
      }

      await axios.post(`${Config.BASE_URL}/register/${type}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Registration Successful",
        "You have successfully registered."
      );
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const AREA_OPTIONS = [
    { value: "", label: "Select One" },
    { value: "art", label: "Art and Photography" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty and Makeup" },
    { value: "business", label: "Business" },
    { value: "diversity", label: "Diversity and Inclusion" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "fashion", label: "Fashion" },
    { value: "finance", label: "Finance" },
    { value: "food", label: "Food and Beverage" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health and Wellness" },
    { value: "home", label: "Home and Gardening" },
    { value: "outdoor", label: "Outdoor and Nature" },
    { value: "parenting", label: "Parenting and Family" },
    { value: "pets", label: "Pets" },
    { value: "sports", label: "Sports and Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "videography", label: "Videography" },
  ];

  return (
    <View style={authStyles.container}>
      <Loader visible={isLoading} />
      <Text style={authStyles.h1}>Additional Information</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: width * 0.95,
          marginBottom: 15,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
          borderTopColor: "#ddd",
          borderTopWidth: 1,
        }}
      >
        <CustomButton title={"Profile Photo"} onPress={handleFileChange} />
        <Text style={[commonStyles.text, { marginRight: 10 }]}>
          {filename
            ? filename.length > 20
              ? filename.substring(0, 20) + "..."
              : filename
            : "Select a Profile Photo"}
        </Text>
      </View>

      {type === "business" && (
        <TextInput
          style={authStyles.input}
          placeholder="Enter your website address:"
          placeholderTextColor="#000"
          value={formData.website}
          onChangeText={(value) => handleChange("website", value)}
        />
      )}

      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: width * 0.95,
            marginBottom: 15,
            borderBottomColor: "#ddd",
            borderBottomWidth: 1,
          },
          type === "creator"
            ? {}
            : {
                borderTopColor: "#ddd",
                borderTopWidth: 1,
              },
        ]}
      >
        <CustomButton
          title={"Category"}
          onPress={() => setShowAreaModal(true)}
        />
        <Text style={[commonStyles.text, { marginRight: 10 }]}>
          {type === "creator"
            ? formData.area
              ? formData.area
              : "Select your area of expertise"
            : formData.target_audience
            ? formData.target_audience
            : "Select your business category"}
        </Text>
      </View>

      {/* <BouncyCheckbox
        isChecked={agree}
        fillColor="blue"
        useBuiltInState={false}
        onPress={() => setAgree(!agree)}
        size={20}
      /> */}

      <View style={commonStyles.centerVertical}>
        <Text>By clicking Register, you agree to our </Text>
        <View style={commonStyles.center}>
          <TouchableOpacity
            onPress={() => {
              setPrivacyModal(true);
            }}
          >
            <Text style={{ fontWeight: "600", color: "blue" }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
          <Text> and </Text>
          <TouchableOpacity
            onPress={() => {
              setEulaModal(true);
            }}
          >
            <Text style={{ fontWeight: "600", color: "blue" }}>
              End User License Agreement
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showAreaModal} transparent={true} animationType="fade">
        <View style={jobsStyles.modalContainer}>
          <View style={jobsStyles.modalContent}>
            <Text style={jobsStyles.modalTitle}>
              {type === "creator"
                ? "Select your area of expertise"
                : "Select your business category"}
            </Text>
            <Picker
              selectedValue={formData.target_creator}
              style={jobsStyles.picker}
              onValueChange={(value) => {
                type === "creator"
                  ? handleChange("area", value)
                  : handleChange("target_audience", value);
                setShowAreaModal(false);
              }}
            >
              {AREA_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
            <CustomButton
              title="Close"
              onPress={() => setShowAreaModal(false)}
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

      {/* <Modal visible={showAreaModal} transparent={true} animationType="fade">
        <View style={authStyles.modalOverlay}>
          <View style={authStyles.modalContainer}>
            <View
              style={
                Platform.OS === "ios"
                  ? {}
                  : [
                      authStyles.input,
                      { width: width * 0.7, flexDirection: "column" },
                    ]
              }
            >
              {Platform.OS === "android" && (
                <Text>Select from dropdown 👉🏻</Text>
              )}
              <Picker
                selectedValue={
                  type === "creator" ? formData.area : formData.target_audience
                }
                style={[
                  authStyles.picker,
                  { marginBottom: Platform.OS === "ios" ? 250 : 10 },
                ]}
                onValueChange={(value) => {
                  type === "creator"
                    ? handleChange("area", value)
                    : handleChange("target_audience", value);
                  setShowAreaModal(false);
                }}
              >
                {AREA_OPTIONS.map((area) => (
                  <Picker.Item
                    key={area.value}
                    label={area.label}
                    value={area.value}
                  />
                ))}
              </Picker>
            </View>
            <CustomButton
              title="Close"
              onPress={() => setShowAreaModal(false)}
            />
          </View>
        </View>
      </Modal> */}

      <CustomButton title="Register" onPress={handleSubmit} />
    </View>
  );
};

export default AdditionalInfo;
