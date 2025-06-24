import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import Hyperlink from "react-native-hyperlink";
import React, { useEffect, useRef, useState } from "react";
import {
  faArrowLeft,
  faEllipsisVertical,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Modalize } from "react-native-modalize";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../common/customButton";
import profileStyles from "../styles/profile";
import ProfilePosts from "./profilePosts";
import LoadingSpinner from "./loading";
import Config from "../config";
import { useNavigation } from "@react-navigation/native";
import homeStyles from "../styles/home";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProfiles,
  fetchOtherCollabs,
  fetchOtherPosts,
  fetchOtherProfile,
  handleBlock,
  handleFollow,
  handleUnblock,
  handleUnfollow,
} from "../slices/profilesSlice";
import commonStyles from "../styles/common";
import authStyles from "../styles/auth";

const Profiles = ({ route }) => {
  const { username } = route.params;

  const [activeTab, setActiveTab] = useState("posts");
  const [refreshing, setRefreshing] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [report, setReport] = useState("");
  const [imageModal, setImageModal] = useState(false);

  const { width } = Dimensions.get("screen");

  const aboutModalize = useRef(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { otherProfile, otherPosts, otherCollabs } = useSelector(
    (state) => state.profiles
  );

  useEffect(() => {
    dispatch(fetchOtherProfile(username));
    dispatch(fetchOtherPosts(username));
  }, []);

  useEffect(() => {
    otherProfile &&
      otherProfile.user.user_type === "business" &&
      dispatch(fetchOtherCollabs(username));
  }, [otherProfile]);

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={otherPosts} />;
      case "instagram":
        return (
          <View style={{ alignItems: "center" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} size={36} />
            <Text style={[commonStyles.h4, { textAlign: "center" }]}>
              {otherProfile.user.name} hasn't connected their Instagram yet!
            </Text>
          </View>
        );
      case "youtube":
        return (
          <View style={{ alignItems: "center" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} size={36} />
            <Text style={[commonStyles.h4, { textAlign: "center" }]}>
              {otherProfile.user.name} hasn't connected their Youtube yet!
            </Text>
          </View>
        );
      case "collabs":
        return <ProfilePosts posts={otherCollabs} />;
      default:
        return <Text>Instagram Info</Text>;
    }
  };

  if (!otherProfile) {
    return <View />;
  } else if (otherProfile.is_blocker) {
    return (
      <View style={profileStyles.profile}>
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
              dispatch(clearProfiles());
              navigation.goBack();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => aboutModalize.current?.open()}>
            <FontAwesomeIcon icon={faEllipsisVertical} size={20} />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            You cannot view this profile
          </Text>
        </View>
      </View>
    );
  }

  const AREA_OPTIONS = [
    { value: "", label: "Select Target Audience" },
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

  const AREA_OPTIONS_OBJECT = AREA_OPTIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return (
    <SafeAreaView style={profileStyles.profile}>
      <StatusBar backgroundColor="#fff" />

      <View style={commonStyles.pageHeader}>
        <TouchableOpacity
          onPress={() => {
            dispatch(clearProfiles());
            navigation.goBack();
          }}
          style={commonStyles.center}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={20}
            style={{ marginRight: 20 }}
          />
          <Text style={commonStyles.backText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => aboutModalize.current?.open()}>
          <FontAwesomeIcon icon={faEllipsisVertical} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              dispatch(fetchOtherProfile(username));
              dispatch(fetchOtherPosts(username));
              setRefreshing(false);
            }}
          />
        }
      >
        <View style={profileStyles.profileTop}>
          <View style={profileStyles.profileDetails}>
            <TouchableOpacity onPress={() => setImageModal(true)}>
              <Image
                source={{
                  uri: `${Config.BASE_URL}${otherProfile.user.profile_photo}`,
                }}
                style={profileStyles.profilePicture}
              />
            </TouchableOpacity>

            <View style={profileStyles.profileData}>
              <View style={profileStyles.profileCount}>
                <Text style={{ fontFamily: "sen-400" }}>
                  {otherPosts.length}
                </Text>
                <Text style={{ fontFamily: "sen-400" }}>Posts</Text>
              </View>
              <View style={profileStyles.profileCount}>
                <Text style={{ fontFamily: "sen-400" }}>
                  {otherProfile.user.followers_count}
                </Text>
                <Text style={{ fontFamily: "sen-400" }}>Followers</Text>
              </View>
              <View style={profileStyles.profileCount}>
                <Text style={{ fontFamily: "sen-400" }}>
                  {otherProfile.user.following_count}
                </Text>
                <Text style={{ fontFamily: "sen-400" }}>Following</Text>
              </View>
            </View>
          </View>
          <View style={profileStyles.profileBio}>
            <Text style={{ fontFamily: "sen-500" }}>
              {otherProfile.user.name}
            </Text>
            <Text style={{ fontFamily: "sen-400" }}>
              {otherProfile.user.bio}
            </Text>
            {otherProfile.website && (
              <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "sen-400",
                  }}
                >
                  <FontAwesomeIcon icon={faLink} />{" "}
                  <Text>{otherProfile.website}</Text>
                </Text>
              </Hyperlink>
            )}
            <View style={profileStyles.profileArea}>
              <Text style={{ fontFamily: "sen-600" }}>
                {otherProfile && otherProfile.user.user_type === "creator"
                  ? AREA_OPTIONS_OBJECT[otherProfile.area]
                  : AREA_OPTIONS_OBJECT[otherProfile.target_audience]}
              </Text>
            </View>
          </View>
          <CustomButton
            title={
              otherProfile && otherProfile.is_blocking
                ? "Unblock"
                : otherProfile && otherProfile.is_following
                ? "Unfollow"
                : "Follow"
            }
            onPress={() => {
              otherProfile && otherProfile.is_blocking
                ? dispatch(handleUnblock(username))
                : otherProfile && otherProfile.is_following
                ? dispatch(handleUnfollow(username))
                : dispatch(handleFollow(username));
            }}
          />
        </View>

        {otherProfile && otherProfile.is_blocking ? (
          <View>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              You have blocked this user. Unblock to see their profile
            </Text>
          </View>
        ) : (
          <View style={profileStyles.profileBottom}>
            <View style={profileStyles.tabsContainer}>
              <TouchableOpacity
                style={[
                  profileStyles.tabButton,
                  activeTab === "posts" && profileStyles.activeTab,
                ]}
                onPress={() => setActiveTab("posts")}
              >
                <Text style={profileStyles.tabText}>Posts</Text>
              </TouchableOpacity>

              {otherProfile && otherProfile.user.user_type === "creator" && (
                <TouchableOpacity
                  style={[
                    profileStyles.tabButton,
                    activeTab === "instagram" && profileStyles.activeTab,
                  ]}
                  onPress={() => setActiveTab("instagram")}
                >
                  <FontAwesomeIcon icon={faInstagram} size={20} />
                </TouchableOpacity>
              )}

              {otherProfile && otherProfile.user.user_type === "creator" && (
                <TouchableOpacity
                  style={[
                    profileStyles.tabButton,
                    activeTab === "youtube" && profileStyles.activeTab,
                  ]}
                  onPress={() => setActiveTab("youtube")}
                >
                  <FontAwesomeIcon icon={faYoutube} size={20} />
                </TouchableOpacity>
              )}

              {otherProfile && otherProfile.user.user_type === "business" && (
                <TouchableOpacity
                  style={[
                    profileStyles.tabButton,
                    activeTab === "collabs" && profileStyles.activeTab,
                  ]}
                  onPress={() => setActiveTab("collabs")}
                >
                  <Text
                    style={{
                      fontFamily: "sen-600",
                      fontSize: 15,
                    }}
                  >
                    Collabs
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View>{renderContent()}</View>
          </View>
        )}
      </ScrollView>

      <Modalize
        ref={aboutModalize}
        adjustToContentHeight={true}
        HeaderComponent={
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.headerText}>About</Text>
          </View>
        }
        avoidKeyboardLikeIOS={true}
      >
        <View style={{ padding: 10, paddingBottom: 20 }}>
          <TouchableOpacity onPress={() => setReportModal(true)}>
            <Text
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              Report User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              otherProfile.is_blocking
                ? dispatch(handleUnblock(username))
                : Alert.alert("Block User", "Do you want to block this user?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Block",
                      style: "destructive",
                      onPress: () => {
                        dispatch(handleBlock(username));
                        aboutModalize.current?.close();
                      },
                    },
                  ]);
            }}
          >
            <Text
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              {otherProfile.is_blocking ? "Unblock" : "Block"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>

      <Modal visible={imageModal} animationType="fade" transparent={true}>
        <View style={profileStyles.modalContainer}>
          <View>
            <Image
              source={{
                uri: `${Config.BASE_URL}${otherProfile?.user.profile_photo}`,
              }}
              style={{
                width: width * 0.8,
                height: width * 0.8,
                borderRadius: width * 0.4,
              }}
            />
            <View style={commonStyles.centerVertical}>
              <CustomButton
                title="Close"
                onPress={() => setImageModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={reportModal} transparent={true} animationType="fade">
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Report Form</Text>
            <TextInput
              style={[authStyles.input, { height: 200 }]}
              placeholder={
                "If you believe this profile, or user activity violates our community guidelines, please report it using this form"
              }
              placeholderTextColor={"#999"}
              textAlign="justify"
              value={report}
              onChangeText={(value) => setReport(value)}
              multiline
            />
            <View style={commonStyles.center}>
              <CustomButton
                title={"Close"}
                onPress={() => setReportModal(false)}
              />
              <CustomButton
                title={"Submit"}
                disabled={report.length < 1}
                onPress={() => {
                  setReport("");
                  setReportModal(false);
                  Alert.alert(
                    "Request Received",
                    "Thank you for reaching out. Our support team has received your message and will take necessary actions"
                  );
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default Profiles;
