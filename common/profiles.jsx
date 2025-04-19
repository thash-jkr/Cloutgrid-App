import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import {
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import Hyperlink from "react-native-hyperlink";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import CustomButton from "../common/CustomButton";
import profileStyles from "../styles/profile";
import ProfilePosts from "./profilePosts";
import LoadingSpinner from "./loading";
import Config from "../config";

const Profiles = ({ route }) => {
  const { username } = route.params;

  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [type, setType] = useState("");

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(`${Config.BASE_URL}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status == 200) {
          setLoggedInUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(
          `${Config.BASE_URL}/profiles/${username}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data) {
          setProfile(response.data);
          response.data.date_of_birth
            ? setType("creator")
            : setType("business");
        }
        const isFollowingResponse = await axios.get(
          `${Config.BASE_URL}/profiles/${username}/is_following/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsFollowing(isFollowingResponse.data.is_following);
      } catch (error) {
        console.log("Cannot find other user", error);
      }
    };

    fetchProfile();
  }, [username, loggedInUser, isFollowing]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!profile) {
          return;
        }
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(
          `${Config.BASE_URL}/posts/${username}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
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

    fetchPosts();
  }, [profile]);

  const handleFollow = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      await axios.post(`${Config.BASE_URL}/profiles/${username}/follow/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsFollowing(true);
    } catch (error) {
      console.log("Error following user", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      await axios.post(`${Config.BASE_URL}/profiles/${username}/unfollow/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsFollowing(false);
    } catch (error) {
      console.log("Error following user", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <ProfilePosts posts={posts} />;
      case "instagram":
        return (
          <View style={{ alignItems: "center" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} size={50} />
            <Text style={profileStyles.h2}>
              {profile.user.name} hasn't connected their Instagram yet!
            </Text>
          </View>
        );
      case "tiktok":
        return (
          <View style={{ alignItems: "center" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} size={50} />
            <Text style={profileStyles.h2}>
              {profile.user.name} hasn't connected their Tiktok yet!
            </Text>
          </View>
        );
      case "youtube":
        return (
          <View style={{ alignItems: "center" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} size={50} />
            <Text style={profileStyles.h2}>
              {profile.user.name} hasn't connected their Youtube yet!
            </Text>
          </View>
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
        <CustomButton
          title={isFollowing ? "Unfollow" : "Follow"}
          onPress={isFollowing ? handleUnfollow : handleFollow}
        />
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
            <Text style={profileStyles.tabText}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "instagram" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("instagram")}
          >
            <FontAwesomeIcon icon={faInstagram} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "tiktok" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("tiktok")}
          >
            <FontAwesomeIcon icon={faTiktok} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              profileStyles.tabButton,
              activeTab === "youtube" && profileStyles.activeTab,
            ]}
            onPress={() => setActiveTab("youtube")}
          >
            <FontAwesomeIcon icon={faYoutube} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView>{renderContent()}</ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profiles;
