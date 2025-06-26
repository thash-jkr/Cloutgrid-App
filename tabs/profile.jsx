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
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faLink, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Hyperlink from "react-native-hyperlink";

import profileStyles from "../styles/profile";
import CustomButton from "../common/customButton";
import EditProfileModal from "../modals/editProfileModal";
import ProfilePosts from "../common/profilePosts";
import Config from "../config";
import LoadingSpinner from "../common/loading";
import commonStyles from "../styles/common";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCollabs,
  fetchPosts,
  fetchProfile,
  resetUpdateStatus,
  updateProfile,
} from "../slices/profileSlice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [refreshing, setRefreshing] = useState(false);
  const [inModal, setInModal] = useState(false);
  const [ytModal, setYtModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, type } = useSelector((state) => state.auth);
  const { posts, collabs, profileLoading } = useSelector(
    (state) => state.profile
  );

  const { width } = Dimensions.get("screen");

  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchPosts());
    type === "business" && dispatch(fetchCollabs());
  }, [user, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchPosts());
    dispatch(fetchProfile());
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
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#fff" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={profileStyles.profileTop}>
          <View style={profileStyles.profileDetails}>
            <TouchableOpacity onPress={() => setImageModal(true)}>
              <Image
                source={{
                  uri: `${Config.BASE_URL}${user.user.profile_photo}`,
                }}
                style={profileStyles.profilePicture}
              />
            </TouchableOpacity>
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
            <Text style={{ fontWeight: "600", fontSize: 13 }}>
              {user.user.name} | @{user.user.username}
            </Text>

            <Text style={{ fontSize: 12 }}>{user.user.bio}</Text>

            {user.website && (
              <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faLink} /> <Text>{user.website}</Text>
                </Text>
              </Hyperlink>
            )}

            <View style={commonStyles.center}>
              <View style={profileStyles.profileArea}>
                <Text style={{ fontWeight: 600, fontSize: 12 }}>
                  {type === "creator"
                    ? AREA_OPTIONS_OBJECT[user.area]
                    : AREA_OPTIONS_OBJECT[user.target_audience]}
                </Text>
              </View>
              {profileLoading && <ActivityIndicator />}
            </View>
          </View>
          <View style={profileStyles.button}>
            <CustomButton
              title="Edit Profile"
              onPress={() => navigation.navigate("EditProfile")}
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
                  fontWeight: "600",
                  fontSize: 14,
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

      <Modal visible={imageModal} animationType="fade" transparent={true}>
        <View style={profileStyles.modalContainer}>
          <View>
            <Image
              source={{
                uri: `${Config.BASE_URL}${user.user.profile_photo}`,
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
    </View>
  );
};

export default Profile;
