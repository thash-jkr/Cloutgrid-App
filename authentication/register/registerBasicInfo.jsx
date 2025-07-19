import {
  Text,
  View,
  Alert,
  Platform,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "../../common/customButton";
import AboutModal from "../../modals/aboutModal";
import commonStyles from "../../styles/common";
import { useDispatch, useSelector } from "react-redux";
import { handleSendOTP, handleVerifyOTP } from "../authSlice";

const BasicInfo = ({
  nextStep,
  formData,
  handleChange,
  emailVerified,
  setEmailVerified,
  type,
}) => {
  const [aboutContent, setAboutContent] = useState({
    title: "",
    body: "",
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [OTP, setOTP] = useState(null);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const aboutModalize = useRef(null);
  const dispatch = useDispatch();

  const { authLoading } = useSelector((state) => state.auth);

  const sendOTP = () => {
    if (
      !formData.user.name ||
      !formData.user.username ||
      !formData.user.email
    ) {
      Alert.alert("Error", "Please complete all the fields");
      return;
    }

    const data = new FormData();
    data.append("name", formData.user.name);
    data.append("username", formData.user.username);
    data.append("email", formData.user.email);

    dispatch(handleSendOTP(data))
      .unwrap()
      .then(() => {
        setShowOTPModal(true);
        setEmailVerified(false);
      })
      .catch((error) => {
        Alert.alert("Error", error);
      });
  };

  const verifyOTP = () => {
    const data = new FormData();
    data.append("username", formData.user.username);
    data.append("otp", OTP);

    dispatch(handleVerifyOTP(data))
      .unwrap()
      .then(() => {
        setShowOTPModal(false);
        setEmailVerified(true);
        nextStep();
      })
      .catch((error) => {
        Alert.alert("Error", error);
      });
  };

  const handleNoOTP = () => {
    try {
      setShowOTPModal(false);
      setEmailVerified(true);
      nextStep();
    } catch (error) {
      Alert.alert("Error", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={commonStyles.pageHeader}>
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
          <Text style={commonStyles.backText}>
            {type === "creator" ? "Creator" : "Business"} Registration
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardOpeningTime={0}
        contentContainerStyle={[
          commonStyles.centerVertical,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Name: </Text>
          </View>

          <TextInput
            placeholder="Enter your name"
            value={formData.user.name}
            onChangeText={(value) => handleChange("name", value)}
            style={commonStyles.input}
            placeholderTextColor={"#888"}
          />
        </View>

        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Username: </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutContent({
                  title: "Username",
                  body: "Your username is your unique identifier on Cloutgrid. It will appear in your profile URL and can be used by others to search and mention you. \nChoose wisely — you can’t change it later.",
                });
                aboutModalize.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter a username"
            value={formData.user.username}
            onChangeText={(value) => handleChange("username", value)}
            style={commonStyles.input}
            placeholderTextColor={"#888"}
          />
        </View>

        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Email: </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutContent({
                  title: "Email Address",
                  body: "This email will be used to verify your account and help you log in securely. Make sure to enter an email you actively use",
                });
                aboutModalize.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
            {emailVerified && (
              <View style={commonStyles.center}>
                <Text
                  style={{
                    color: "green",
                    marginLeft: 10,
                    fontFamily: "Poppins_500Medium",
                  }}
                >
                  Verified
                </Text>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size={15}
                  style={{ marginLeft: 5, color: "green" }}
                />
              </View>
            )}
          </View>
          <TextInput
            placeholder="Enter your Email"
            value={formData.user.email}
            onChangeText={(value) => {
              setShowOTPModal(false);
              handleChange("email", value);
            }}
            style={[commonStyles.input, emailVerified && { opacity: 0.5 }]}
            placeholderTextColor={"#888"}
            keyboardType="email-address"
            editable={!emailVerified}
          />
        </View>

        {showOTPModal && (
          <View style={commonStyles.centerLeft}>
            <View style={commonStyles.center}>
              <Text style={commonStyles.h4}>OTP: </Text>
            </View>
            <TextInput
              placeholder="Enter the OTP sent to your email"
              value={OTP}
              onChangeText={(value) => setOTP(value)}
              style={commonStyles.input}
              placeholderTextColor={"#888"}
            />
          </View>
        )}

        <CustomButton
          title={"Continue"}
          onPress={() =>
            emailVerified ? nextStep() : showOTPModal ? verifyOTP() : sendOTP()
          }
          isLoading={authLoading}
        />
      </KeyboardAwareScrollView>

      <AboutModal
        modalizeRef={aboutModalize}
        title={aboutContent.title}
        body={aboutContent.body}
      />
    </KeyboardAvoidingView>
  );
};

export default BasicInfo;
