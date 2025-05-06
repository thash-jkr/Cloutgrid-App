import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import commonStyles from "../styles/common";
import homeStyles from "../styles/home";
import Config from "../config";
import { Modalize } from "react-native-modalize";

const ProfilePostsDetails = ({ route }) => {
  const [selectedPost, setSelectedPost] = useState(null)

  const navigation = useNavigation();
  const { postss } = route.params;
  const [posts, setPosts] = useState(postss);

  const aboutModalize = useRef(null);
  const lastTapRef = useRef(null);

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

  return (
    <SafeAreaView
      style={[commonStyles.container, { justifyContent: "flex-start" }]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          paddingLeft: 20,
          padding: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("ProfileMain")}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontSize: 20 }}>Posts</Text>
      </View>
      <ScrollView>
        {posts.map((post) => (
          <View key={post.id} style={homeStyles.post}>
            <View style={homeStyles.postHeader}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProfileMain");
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
                  <Text style={{ fontFamily: "sen-400" }}>{post.caption}</Text>
                </Text>
              </View>
            </View>
          </View>
        ))}
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
            Delete Post
          </Text>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

export default ProfilePostsDetails;
