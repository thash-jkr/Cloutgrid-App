import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faHeart as faHeartSolid,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart,
  faComment,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import { TouchableOpacity } from "react-native";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import homeStyles from "../styles/home";
import commonStyles from "../styles/common";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import CustomButton from "../common/customButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed, likePost } from "../slices/feedSlice";
import { handleBlock } from "../slices/profilesSlice";
import { deletePost } from "../slices/profileSlice";
import Triangle from "../common/triangle";
import Loader from "../common/loading";

const Home = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [report, setReport] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const aboutModalize = useRef(null);
  const lastTapRef = useRef(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchFeed());
    setIsLoading(false);
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);
  const { posts } = useSelector((state) => state.feed);
  const count = useSelector((state) => state.notif.count);

  const handleTap = (post) => {
    const now = new Date().getTime();
    const delay = 300;

    if (now - lastTapRef.current < delay) {
      handleLike(post.id);
    }

    lastTapRef.current = now;
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const openAbout = (post) => {
    setSelectedPost(post);
    aboutModalize.current?.open();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchFeed());
    setRefreshing(false);
  };

  return (
    <View style={[homeStyles.home, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#fff" barStyle={"dark-content"} />
      <Loader visible={isLoading} />
      <View style={[homeStyles.header]}>
        <View>
          <Text style={homeStyles.h2}>
            CLOUT<Text style={homeStyles.logoSide}>Grid</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[homeStyles.bell, commonStyles.center]}
          onPress={() => navigation.navigate("Notifications")}
        >
          <FontAwesomeIcon icon={faBell} size={20} />
          <View
            style={[
              commonStyles.center,
              {
                backgroundColor: "red",
                borderRadius: "50%",
                height: 15,
                width: 15,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 10,
                color: "#fff",
                fontWeight: "700",
              }}
            >
              {count}
            </Text>
          </View>
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
                    if (post.author.username === user.user.username) {
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
                      <Triangle color="#0077B6" size={25} filled={true} />
                    ) : (
                      <Triangle color="#0077B6" size={25} filled={false} />
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
                    <Text style={{ textAlign: "left", fontWeight: 400 }}>
                      {post.caption}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>No Posts Found</Text>
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
          {selectedPost &&
          selectedPost.author.username === user?.user.username ? (
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
                          aboutModalize.current?.close();
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

              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Block User", "Do you want to block this user?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Block",
                      style: "destructive",
                      onPress: () => {
                        dispatch(handleBlock(selectedPost?.author.username));
                        aboutModalize.current?.close();
                      },
                    },
                  ]);
                }}
              >
                <Text
                  style={{
                    padding: 10,
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                  }}
                >
                  Block User
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
                "If you believe this post, profile, or user activity violates our community guidelines, please report it using this form"
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

export default Home;
