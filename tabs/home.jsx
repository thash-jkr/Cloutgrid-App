import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faHeart as faHeartSolid,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { TouchableOpacity } from "react-native";
import { Modalize } from "react-native-modalize";

import homeStyles from "../styles/home";
import Config from "../config";
import LoadingSpinner from "../common/loading";
import commonStyles from "../styles/common";

const Home = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const aboutModalize = useRef(null);
  const lastTapRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.get(`${Config.BASE_URL}/posts/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(`${Config.BASE_URL}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status == 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  const handleTap = (post) => {
    const now = new Date().getTime();
    const delay = 300;

    if (now - lastTapRef.current < delay) {
      handleLike(post.id);
    }

    lastTapRef.current = now;
  };

  const handleLike = async (postId) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `${Config.BASE_URL}/posts/${postId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            like_count:
              response.data.message === "Post liked"
                ? post.like_count + 1
                : post.like_count - 1,
            is_liked: response.data.message === "Post liked",
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const openAbout = (post) => {
    setSelectedPost(post);
    aboutModalize.current?.open();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={homeStyles.home}>
      <StatusBar backgroundColor="#fff" barStyle={"dark-content"} />
      <View style={[homeStyles.header]}>
        <View>
          <Text style={homeStyles.h2}>
            CLOUT<Text style={homeStyles.logoSide}>Grid</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={homeStyles.bell}
          onPress={() => navigation.navigate("Notifications")}
        >
          <FontAwesomeIcon icon={faBell} size={20} />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[homeStyles.postContainer]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length > 0 ? (
          posts.map((post) => (
            <View key={post.id} style={homeStyles.post}>
              <View style={homeStyles.postHeader}>
                <TouchableOpacity
                  onPress={() => {
                    if (post.author.username === user.username) {
                      navigation.navigate("Profile");
                      return;
                    }
                    navigation.navigate("Profiles", {
                      username: post.author.username,
                    });
                  }}
                  style={commonStyles.center}
                >
                  <Image
                    style={homeStyles.profilePicture}
                    source={{
                      uri: `${post.author.profile_photo}`,
                    }}
                  />
                  <Text style={homeStyles.postAuthor}>{post.author.name}</Text>
                </TouchableOpacity>
                {post.collaboration && (
                  <TouchableOpacity
                    onPress={() => {
                      if (post.collaboration.user.username === user.username) {
                        navigation.navigate("Profile");
                        return;
                      }
                      navigation.navigate("Profiles", {
                        username: post.collaboration.user.username,
                      });
                    }}
                  >
                    <Text>
                      {" "}
                      with{" "}
                      <Text style={homeStyles.postAuthor}>
                        {post.collaboration.user.name}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{ position: "absolute", right: 10 }}
                  onPress={() => openAbout(post)}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} size={20} />
                </TouchableOpacity>
              </View>
              <TouchableWithoutFeedback onPress={() => handleTap(post)}>
                <Image
                  style={homeStyles.postImage}
                  source={{ uri: `${post.image}` }}
                />
              </TouchableWithoutFeedback>
              <View style={homeStyles.postFooter}>
                <View style={homeStyles.postFooterIcons}>
                  <TouchableOpacity onPress={() => handleLike(post.id)}>
                    {post.is_liked ? (
                      <FontAwesomeIcon
                        icon={faHeartSolid}
                        size={25}
                        style={{ color: "#0096C7" }}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faHeart} size={25} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ fontFamily: "sen-400" }}>
                    <Text>{post.like_count} Likes </Text>
                    <Text>|</Text>
                    <Text> {post.comment_count} Comments</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Comments", { post: post })
                    }
                  >
                    <FontAwesomeIcon icon={faComment} size={25} />
                  </TouchableOpacity>
                </View>
                <View style={homeStyles.postFooterText}>
                  <Text>
                    <Text style={homeStyles.postFooterTextBold}>
                      {post.author.username}
                    </Text>
                    {"  "}
                    <Text style={{ fontFamily: "sen-400" }}>
                      {post.caption}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <LoadingSpinner />
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
        onClose={() => setSelectedPost(null)}
      >
        <View style={{ padding: 10, paddingBottom: 20 }}>
          <Text
            style={{
              padding: 10,
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
            }}
          >
            Report Post
          </Text>
          <Text
            style={{
              padding: 10,
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
            }}
          >
            Follow @{selectedPost ? selectedPost.author.username : ""}
          </Text>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

export default Home;
