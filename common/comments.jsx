import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import homeStyles from "../styles/home";
import commonStyles from "../styles/common";
import CustomButton from "./CustomButton";
import Config from "../config";

const Comments = ({ route }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { post } = route.params;

  const { height, width } = Dimensions.get("window");

  useEffect(() => {
    const fetchComments = async () => {
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

    fetchComments();
  }, []);

  const handleAddComment = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `${Config.BASE_URL}/posts/${post.id}/comments/`,
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

  const dateParser = (dateTime) => {
    const [date, time] = dateTime.split("T");
    return new Date(date).toDateString();
  };

  return (
    <SafeAreaView
      style={[commonStyles.container, { justifyContent: "space-between" }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 45}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={commonStyles.h1}>Comments</Text>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            style={{ width: width, flex: 1 }}
          >
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
        </View>
        <View style={[homeStyles.commentInputContainer, {}]}>
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
    </SafeAreaView>
  );
};

export default Comments;
