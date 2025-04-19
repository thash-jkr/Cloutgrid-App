import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  RefreshControl,
  SafeAreaView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native";
import { Modalize } from "react-native-modalize";

import homeStyles from "../styles/home";
import CustomButton from "../common/CustomButton";
import Config from "../config";
import LoadingSpinner from "../common/loading";

const Home = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const commentModal = useRef(null);
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

  const handleSelectComment = async (post) => {
    setSelectedPost(post);
    commentModal.current?.open();

    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.get(
        `${Config.BASE_URL}/posts/${post.id}/comments/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `${Config.BASE_URL}/posts/${selectedPost.id}/comments/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const dateParser = (dateTime) => {
    const [date, time] = dateTime.split("T");
    return new Date(date).toDateString();
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
              <TouchableOpacity
                style={homeStyles.postHeader}
                onPress={() => {
                  if (post.author.username === user.username) {
                    navigation.navigate("Profile");
                    return;
                  }
                  navigation.navigate("Profiles", {
                    username: post.author.username,
                  });
                }}
              >
                <Image
                  style={homeStyles.profilePicture}
                  source={{
                    uri: `${post.author.profile_photo}`,
                  }}
                />
                <Text style={homeStyles.postAuthor}>{post.author.name}</Text>
                {post.collaboration && (
                  <Text>
                    {" "}
                    with{" "}
                    <Text style={homeStyles.postAuthor}>
                      {post.collaboration.user.name}
                    </Text>
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableWithoutFeedback onPress={() => handleTap(post)}>
                <Image
                  style={homeStyles.postImage}
                  source={{ uri: `${post.image}` }}
                />
              </TouchableWithoutFeedback>
              <View style={homeStyles.postFooter}>
                <View style={homeStyles.postFooterIcons}>
                  <TouchableOpacity onPress={() => handleLike(post.id)}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      size={25}
                      style={{ color: post.is_liked ? "#0096C7" : "black" }}
                    />
                  </TouchableOpacity>
                  <Text style={{ fontFamily: "sen-400" }}>
                    <Text>{post.like_count} Likes </Text>
                    <Text>|</Text>
                    <Text> {post.comment_count} Comments</Text>
                  </Text>
                  <TouchableOpacity onPress={() => handleSelectComment(post)}>
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
        ref={commentModal}
        adjustToContentHeight={true}
        onClose={() => {
          setNewComment("");
          setComments([]);
        }}
        HeaderComponent={
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.headerText}>Comments</Text>
          </View>
        }
      >
        <KeyboardAvoidingView
          style={homeStyles.modal}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={110}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment.id} style={homeStyles.comment}>
                  <Text>
                    <Text style={homeStyles.commentAuthor}>
                      {comment.user.username}
                    </Text>
                    <Text style={{ fontFamily: "sen-400" }}>
                      {" "}
                      - {dateParser(comment.commented_at)}
                    </Text>
                  </Text>
                  <Text style={{ fontFamily: "sen-400" }}>
                    {comment.content}
                  </Text>
                </View>
              ))
            ) : (
              <Text
                style={{
                  fontFamily: "sen-500",
                  fontSize: 17,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                No comments yet
              </Text>
            )}
          </ScrollView>
          <View style={homeStyles.commentInputContainer}>
            <TextInput
              style={homeStyles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={(value) => setNewComment(value)}
            />
            <CustomButton
              title="Post"
              onPress={handleAddComment}
              disabled={newComment.length === 0}
            />
          </View>
        </KeyboardAvoidingView>
      </Modalize>
    </SafeAreaView>
  );
};

export default Home;
