import {
  View,
  Text,
  Image,
  StatusBar,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import Hyperlink from "react-native-hyperlink";

import profileStyles from "../styles/profile";
import CustomButton from "../common/CustomButton";
import EditProfileModal from "../common/EditProfileModal";
import ProfilePosts from "../common/profilePosts";
import Config from "../config";
import LoadingSpinner from "../common/loading";
import commonStyles from "../styles/common";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCollabs,
  fetchPosts,
  resetUpdateStatus,
  updateProfile,
} from "../slices/profileSlice";

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [refreshing, setRefreshing] = useState(false);
  const [inModal, setInModal] = useState(false);
  const [ytModal, setYtModal] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, type } = useSelector((state) => state.auth);
  const { posts, postsStatus, postsError } = useSelector(
    (state) => state.profile
  );
  const { collabs, collabsStatus, collabsError } = useSelector(
    (state) => state.profile
  );
  const { updateStatus, updateError } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchPosts());
    type === "business" && dispatch(fetchCollabs());
  }, [user, dispatch]);

  useEffect(() => {
    if (updateStatus === "failed") {
      Alert.alert("Error", "Something went wrong");
      dispatch(resetUpdateStatus);
    } else if (updateStatus === "succeeded") {
      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
      dispatch(resetUpdateStatus);
    }
  }, [updateStatus]);

  const handleSave = (updatedProfile) => {
    dispatch(updateProfile(updatedProfile));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchPosts());
    type === "business" && dispatch(fetchCollabs);
    setRefreshing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={posts} />;
      case "instagram":
        return (
          <View style={commonStyles.centerVertical}>
            <View style={{ padding: 10 }}>
              <Text style={commonStyles.h1}>📸 Connect Instagram</Text>
              <Text
                style={{
                  fontWeight: "600",
                  paddingBottom: 5,
                }}
              >
                Showcase your influence with real-time Instagram insights.
              </Text>
              <Text style={{ textAlign: "justify", fontSize: 10 }}>
                By connecting your Instagram account, you can let businesses see
                your follower count, engagement rate, and reach — all from your
                profile. This boosts your credibility and increases your chances
                of landing meaningful collaborations. Your numbers speak for you
                — let them shine.
              </Text>
            </View>
            <View>
              <CustomButton
                title="Connect Instagram"
                onPress={() => setInModal(true)}
              />
            </View>
          </View>
        );
      case "youtube":
        return (
          <View style={commonStyles.centerVertical}>
            <View style={{ padding: 10 }}>
              <Text style={commonStyles.h1}>📺 Connect YouTube</Text>
              <Text
                style={{
                  fontWeight: "600",
                  paddingBottom: 5,
                }}
              >
                Highlight your reach and impact with YouTube analytics.
              </Text>
              <Text style={{ textAlign: "justify", fontSize: 10 }}>
                When you link your YouTube channel, CloutGrid displays key
                metrics like subscriber count, views, and watch time directly on
                your profile. This helps brands see the real value of your
                content and makes your profile stand out in the creator
                community.
              </Text>
            </View>
            <View>
              <CustomButton
                title="Connect Youtube"
                onPress={() => setYtModal(true)}
              />
            </View>
          </View>
        );
      case "collabs":
        return (
          <ProfilePosts
            posts={collabs}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      default:
        return <Text>Instagram Info</Text>;
    }
  };

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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={profileStyles.profileTop}>
          <View style={profileStyles.profileDetails}>
            <Image
              source={{
                uri: `${Config.BASE_URL}${user.user.profile_photo}`,
              }}
              style={profileStyles.profilePicture}
            />
            <View style={profileStyles.profileData}>
              <View style={profileStyles.profileCount}>
                <Text style={{ fontFamily: "sen-400" }}>{posts.length}</Text>
                <Text style={{ fontFamily: "sen-400" }}>Posts</Text>
              </View>
              <View style={profileStyles.profileCount}>
                <Text style={{ fontFamily: "sen-400" }}>
                  {user.user.followers_count}
                </Text>
                <Text style={{ fontFamily: "sen-400" }}>Followers</Text>
              </View>
              <View style={profileStyles.profileCount}>
                <Text style={{ fontFamily: "sen-400" }}>
                  {user.user.following_count}
                </Text>
                <Text style={{ fontFamily: "sen-400" }}>Following</Text>
              </View>
            </View>
          </View>
          <View style={profileStyles.profileBio}>
            <Text style={{ fontFamily: "sen-500" }}>{user.user.name}</Text>
            <Text style={{ fontFamily: "sen-400" }}>{user.user.bio}</Text>
            {user.website && (
              <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "sen-400",
                  }}
                >
                  <FontAwesomeIcon icon={faLink} /> <Text>{user.website}</Text>
                </Text>
              </Hyperlink>
            )}
            <View style={profileStyles.profileArea}>
              <Text style={{ fontFamily: "sen-600" }}>
                {type === "creator"
                  ? AREA_OPTIONS_OBJECT[user.area]
                  : AREA_OPTIONS_OBJECT[user.target_audience]}
              </Text>
            </View>
          </View>
          <View style={profileStyles.button}>
            <CustomButton
              title="Edit Profile"
              onPress={() => setModalVisible(true)}
            />
            <CustomButton
              title="Settings"
              onPress={() => navigation.navigate("Settings")}
            />
          </View>
        </View>
        <View style={profileStyles.profileBottom}>
          <View style={profileStyles.tabsContainer}>
            <TouchableOpacity
              style={[
                profileStyles.tabButton,
                activeTab === "posts" && profileStyles.activeTab,
              ]}
              onPress={() => setActiveTab("posts")}
            >
              <Text
                style={{
                  fontFamily: "sen-600",
                  fontSize: 15,
                }}
              >
                Posts
              </Text>
            </TouchableOpacity>

            {type === "creator" && (
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

            {type === "creator" && (
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

            {type === "business" && (
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
      </ScrollView>

      {modalVisible && (
        <EditProfileModal
          profile={user}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          type={type}
        />
      )}
      <Modal visible={inModal} animationType="fade" transparent={true}>
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  fontWeight: "600",
                  paddingBottom: 5,
                }}
              >
                Instagram insights integration is almost ready
              </Text>
              <Text style={{ textAlign: "justify", fontSize: 10 }}>
                We’re finalizing a secure way to display your Instagram
                performance on your profile. This feature is currently in
                development to ensure the best experience. Thank you for your
                patience as we prepare to unlock even more opportunities for you
              </Text>
            </View>
            <View>
              <CustomButton
                title="Alright!"
                onPress={() => setInModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={ytModal} animationType="fade" transparent={true}>
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  fontWeight: "600",
                  paddingBottom: 5,
                }}
              >
                YouTube analytics integration is on its way
              </Text>
              <Text style={{ textAlign: "justify", fontSize: 10 }}>
                We’re working on making your YouTube performance visible on your
                CloutGrid profile — securely and seamlessly. This feature is
                being carefully built and tested to support better
                collaborations. We appreciate your understanding
              </Text>
            </View>
            <View>
              <CustomButton
                title="Alright!"
                onPress={() => setYtModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
