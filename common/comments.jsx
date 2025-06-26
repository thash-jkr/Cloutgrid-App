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
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import homeStyles from "../styles/home";
import commonStyles from "../styles/common";
import CustomButton from "./customButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import {
  clearComments,
  fetchComments,
  handleAddComment,
  handleDeleteComment,
} from "../slices/feedSlice";
import ReportModal from "../modals/reportModal";

const Comments = ({ route }) => {
  const [newComment, setNewComment] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [reportModal, setReportModal] = useState(false);
  const [report, setReport] = useState("");

  const { post } = route.params;

  const aboutModalize = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const { comments, feedLoading } = useSelector((state) => state.feed);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  const { width } = Dimensions.get("window");

  useEffect(() => {
    dispatch(clearComments());
    dispatch(fetchComments(post.id));
  }, []);

  const addComment = () => {
    try {
      dispatch(handleAddComment({ postId: post.id, comment: newComment }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = (commentId) => {
    try {
      dispatch(handleDeleteComment({ postId: post.id, commentId }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const dateParser = (dateTime) => {
    const [date, time] = dateTime.split("T");
    return new Date(date).toDateString();
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS == "ios" ? 0 : insets.bottom === 0 ? 45 : 0
        }
      >
        <View style={{ alignItems: "center", flex: 1 }}>
          <View style={commonStyles.pageHeader}>
            <TouchableOpacity
              onPress={() => {
                dispatch(clearComments());
                navigation.goBack();
              }}
              style={commonStyles.center}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={20}
                style={{ marginRight: 20 }}
              />
              <Text style={commonStyles.backText}>Comments </Text>
              {feedLoading && <ActivityIndicator />}
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
                              onPress: () => deleteComment(comment.id),
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
            placeholderTextColor={"#888"}
          />
          <CustomButton
            title="Post"
            onPress={addComment}
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

      {reportModal && (
        <ReportModal
          reportModal={reportModal}
          report={report}
          setReport={setReport}
          onClose={() => setReportModal(false)}
          body="If you believe this comment or the user who posted it has violated our community guidelines, please report it using this form"
        />
      )}
    </View>
  );
};

export default Comments;
