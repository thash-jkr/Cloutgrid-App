import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import profileStyles from "../styles/profile";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../common/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import ProfilePosts from "./profilePosts";

import Config from "../config";
import LoadingSpinner from "./loading";

const Profiles = ({ route }) => {
  const { username } = route.params;

  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

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
              <Text>{posts.length}</Text>
              <Text>Posts</Text>
            </View>
            <View style={profileStyles.profileCount}>
              <Text>{profile.user.followers_count}</Text>
              <Text>Followers</Text>
            </View>
            <View style={profileStyles.profileCount}>
              <Text>{profile.user.following_count}</Text>
              <Text>Following</Text>
            </View>
          </View>
        </View>
        <View style={profileStyles.profileBio}>
          <Text style={{ fontWeight: "bold" }}>{profile.user.name}</Text>
          <Text>{profile.user.bio}</Text>
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
