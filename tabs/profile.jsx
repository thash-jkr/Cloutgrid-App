import {
  View,
  Text,
  Image,
  StatusBar,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import Hyperlink from "react-native-hyperlink";

import profileStyles from "../styles/profile";
import CustomButton from "../common/CustomButton";
import EditProfileModal from "../common/EditProfileModal";
import ProfilePosts from "../common/profilePosts";
import Config from "../config";
import LoadingSpinner from "../common/loading";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [type, setType] = useState("");

  const navigation = useNavigation();

  const fetchUser = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.get(`${Config.BASE_URL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setProfile(response.data);
        response.data.date_of_birth ? setType("creator") : setType("business");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      if (!profile) {
        return;
      }
      const access = await SecureStore.getItemAsync("access");
      const response = await axios.get(
        `${Config.BASE_URL}/posts/${profile.user.username}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchCollabs = async () => {
    try {
      if (!profile) {
        return;
      }
      const access = await SecureStore.getItemAsync("access");
      const response = await axios.get(`${Config.BASE_URL}/posts/collabs/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (response.data) {
        setCollabs(response.data);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching collabs");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchPosts();
    type === "business" && fetchCollabs();
  }, [profile]);

  const handleSave = async (updatedProfile) => {
    try {
      const data = new FormData();
      data.append("user[name]", updatedProfile.user.name);
      data.append("user[email]", updatedProfile.user.email);
      data.append("user[username]", updatedProfile.user.username);
      if (updatedProfile.user.profile_photo) {
        data.append("user[profile_photo]", updatedProfile.user.profile_photo);
      }

      if (updatedProfile.user.password) {
        data.append("user[password]", updatedProfile.user.password);
      }

      data.append("user[bio]", updatedProfile.user.bio);
      if (type == "creator") {
        data.append("date_of_birth", updatedProfile.date_of_birth);
        data.append("area", updatedProfile.area);
      } else {
        data.append("website", updatedProfile.website);
        data.append("target_audience", updatedProfile.target_audience);
      }

      const response = await axios.put(
        `${Config.BASE_URL}/profile/${type}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Profile updated successfully!");
        setProfile(response.data);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    await fetchPosts();
    type === "business" && fetchCollabs();
    setRefreshing(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <ProfilePosts
            posts={posts}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      case "instagram":
        return (
          <View>
            <CustomButton title="Connect Instagram" />
          </View>
        );
      case "tiktok":
        return (
          <View>
            <CustomButton title="Connect Tiktok" />
          </View>
        );
      case "youtube":
        return (
          <View>
            <CustomButton title="Connect YouTube" />
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

  if (!profile) {
    return <LoadingSpinner />;
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
      <View style={profileStyles.profileTop}>
        <View style={profileStyles.profileDetails}>
          <Image
            source={{
              uri: `${Config.BASE_URL}${profile.user.profile_photo}`,
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
                {profile.user.followers_count}
              </Text>
              <Text style={{ fontFamily: "sen-400" }}>Followers</Text>
            </View>
            <View style={profileStyles.profileCount}>
              <Text style={{ fontFamily: "sen-400" }}>
                {profile.user.following_count}
              </Text>
              <Text style={{ fontFamily: "sen-400" }}>Following</Text>
            </View>
          </View>
        </View>
        <View style={profileStyles.profileBio}>
          <Text style={{ fontFamily: "sen-500" }}>{profile.user.name}</Text>
          <Text style={{ fontFamily: "sen-400" }}>{profile.user.bio}</Text>
          {profile.website && (
            <Hyperlink linkDefault={true} linkStyle={{ color: "#2980b9" }}>
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: "sen-400",
                }}
              >
                <FontAwesomeIcon icon={faLink} /> <Text>{profile.website}</Text>
              </Text>
            </Hyperlink>
          )}
          <View style={profileStyles.profileArea}>
            <Text style={{ fontFamily: "sen-600" }}>
              {type === "creator"
                ? AREA_OPTIONS_OBJECT[profile.area]
                : AREA_OPTIONS_OBJECT[profile.target_audience]}
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
                activeTab === "tiktok" && profileStyles.activeTab,
              ]}
              onPress={() => setActiveTab("tiktok")}
            >
              <FontAwesomeIcon icon={faTiktok} size={20} />
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderContent()}
        </ScrollView>
      </View>

      {modalVisible && (
        <EditProfileModal
          profile={profile}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          type={type}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
