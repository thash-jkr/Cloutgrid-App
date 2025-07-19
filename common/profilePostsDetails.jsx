import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare,
  faCircleUp as unlike,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import commonStyles from "../styles/common";
import homeStyles from "../styles/home";
import Config from "../config";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../slices/profileSlice";
import Triangle from "./triangle";
import ReportModal from "../modals/reportModal";

const ProfilePostsDetails = ({ route }) => {
  const { postss } = route.params;

  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState(postss);
  const [reportModal, setReportModal] = useState(false);
  const [report, setReport] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const aboutModalize = useRef(null);
  const lastTapRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const insets = useSafeAreaInsets();

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
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View style={commonStyles.pageHeader}>
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
          <Text style={commonStyles.backText}>Posts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {posts.map((post) => (
          <View key={post.id} style={homeStyles.post}>
            <View style={homeStyles.postHeader}>
              <TouchableOpacity onPress={() => {}} style={commonStyles.center}>
                <Image
                  style={homeStyles.profilePicture}
                  source={{
                    uri: `${post.author.profile_photo}`,
                  }}
                />
                <Text style={homeStyles.postAuthor}>{post.author.name}</Text>
              </TouchableOpacity>
              {post.collaboration && (
                <TouchableOpacity onPress={() => {}}>
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
            <TouchableWithoutFeedback
              onPress={() => !post.is_liked && handleTap(post)}
            >
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
                      icon={faCircleUp}
                      size={25}
                      color="rgb(249 115 22)"
                    />
                  ) : (
                    <FontAwesomeIcon icon={unlike} size={25} />
                  )}
                </TouchableOpacity>
                <Text style={[commonStyles.center, { fontWeight: 500 }]}>
                  <Text>{post.like_count} Hits </Text>
                  <Text>|</Text>
                  <Text> {post.comment_count} Comments</Text>
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Comments", { post: post })
                  }
                >
                  <FontAwesomeIcon icon={faSquare} size={25} />
                </TouchableOpacity>
              </View>

              <View style={homeStyles.postFooterText}>
                <View>
                  <Text style={homeStyles.postFooterTextBold}>
                    {post.author.username}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PostDetail", { id: post.id })
                    }
                  >
                    <Text style={{ textAlign: "left", fontWeight: 400 }}>
                      {post.caption.length < 200
                        ? post.caption
                        : post.caption.slice(0, 150) + ".......\n"}
                    </Text>
                    {post.caption.length > 199 && (
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#888",
                          fontWeight: "700",
                        }}
                      >
                        .......read more.......
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
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
          {selectedPost &&
          selectedPost.author.username === user.user.username ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Delete Post",
                    "Do you want to delete this post? This action cannot be undone!",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          dispatch(deletePost(selectedPost?.id));
                          navigation.goBack();
                        },
                      },
                    ]
                  );
                }}
              >
                <Text
                  style={{
                    padding: 10,
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                  }}
                >
                  Delete Post
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TouchableOpacity onPress={() => setReportModal(true)}>
                <Text
                  style={{
                    padding: 10,
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                  }}
                >
                  Report Post
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
          )}
        </View>
      </Modalize>

      {reportModal && (
        <ReportModal
          reportModal={reportModal}
          report={report}
          setReport={setReport}
          onClose={() => setReportModal(false)}
          body="If you believe this post, profile, or user activity violates our community guidelines, please report it using this form"
        />
      )}
    </View>
  );
};

export default ProfilePostsDetails;
