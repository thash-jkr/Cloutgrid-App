import {
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import homeStyles from "../styles/home";
import commonStyles from "../styles/common";
import CustomButton from "./customButton";
import Config from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";

const Comments = ({ route }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [reportModal, setReportModal] = useState(false);
  const [report, setReport] = useState("");

  const { post } = route.params;

  const aboutModalize = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

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

  const handleDeleteComment = async (commentId) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      await axios.delete(
        `${Config.BASE_URL}/posts/${post.id}/comment/${commentId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const dateParser = (dateTime) => {
    const [date, time] = dateTime.split("T");
    return new Date(date).toDateString();
  };

  return (
    <View
      style={[
        commonStyles.container,
        { justifyContent: "space-between", paddingTop: insets.top },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 45}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
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
                navigation.goBack();
              }}
              style={commonStyles.center}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={20}
                style={{ marginRight: 20 }}
              />
              <Text style={commonStyles.backText}>Comments</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            style={{ width: width, flex: 1 }}
          >
            {comments.length > 0 ? (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  style={[
                    homeStyles.comment,
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                  ]}
                >
                  <View>
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
                  {comment?.user?.username === user.user.username ? (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Delete Comment",
                          "Do you want to delete this comment?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => handleDeleteComment(comment.id),
                            },
                          ]
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} size={14} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        aboutModalize.current?.open();
                        setSelectedComment(comment);
                      }}
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} size={16} />
                    </TouchableOpacity>
                  )}
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

      <Modalize
        ref={aboutModalize}
        adjustToContentHeight={true}
        HeaderComponent={
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.headerText}>About</Text>
          </View>
        }
        avoidKeyboardLikeIOS={true}
        onClose={() => setSelectedComment(null)}
      >
        <View style={{ padding: 10, paddingBottom: 20 }}>
          <View>
            <TouchableOpacity onPress={() => setReportModal(true)}>
              <Text
                style={{
                  padding: 10,
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                }}
              >
                Report Comment
              </Text>
            </TouchableOpacity>

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
          </View>
        </View>
      </Modalize>

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
                "If you believe this comment or the user who posted it has violated our community guidelines, please report it using this form"
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
    </View>
  );
};

export default Comments;
