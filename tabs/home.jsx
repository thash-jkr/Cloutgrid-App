import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
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
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import CustomButton from "../common/CustomButton";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed, likePost } from "../slices/feedSlice";

const Home = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [report, setReport] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  const aboutModalize = useRef(null);
  const lastTapRef = useRef(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);
  const { posts, status, error } = useSelector((state) => state.feed);
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
    <SafeAreaView style={homeStyles.home}>
      <StatusBar backgroundColor="#fff" barStyle={"dark-content"} />
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
                      <FontAwesomeIcon
                        icon={faHeartSolid}
                        size={25}
                        style={{ color: "#0096C7" }}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faHeart} size={25} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ fontFamily: "" }}>
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
                    <Text style={{ fontFamily: "" }}>{post.caption}</Text>
                  </Text>
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
          selectedPost.author.username === user.user.username ? (
            <View>
              <TouchableOpacity onPress={() => setReportModal(true)}>
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
              <TouchableOpacity onPress={() => {}}>
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
            <Text style={profileStyles.modalTitle}>Report Post?</Text>
            <TextInput
              style={[authStyles.input, { height: 200 }]}
              placeholder={
                "If you have any issue regarding this particular post, please report to us via this form"
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
    </SafeAreaView>
  );
};

export default Home;
