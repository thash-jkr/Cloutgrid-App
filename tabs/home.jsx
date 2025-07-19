import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faEllipsisVertical,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare,
  faCircleUp as unlike,
} from "@fortawesome/free-regular-svg-icons";
import { TouchableOpacity } from "react-native";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import homeStyles from "../styles/home";
import commonStyles from "../styles/common";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed, likePost } from "../slices/feedSlice";
import { handleBlock } from "../slices/profilesSlice";
import { deletePost } from "../slices/profileSlice";
import ReportModal from "../modals/reportModal";

const Home = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [report, setReport] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [animatingId, setAnimatingId] = useState(-1);

  const aboutModalize = useRef(null);
  const lastTapRef = useRef(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);
  const { posts, feedLoading } = useSelector((state) => state.feed);
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

      <View style={[homeStyles.header]}>
        <Text style={[commonStyles.center, { fontSize: 22 }]}>
          <Text
            style={{
              color: "rgb(23 37 84)",
              fontFamily: "Poppins_700Bold",
            }}
          >
            CLOUT
          </Text>
          <Text style={homeStyles.logoSide}>Grid</Text>
          {feedLoading && <ActivityIndicator />}
        </Text>
        <TouchableOpacity
          style={[homeStyles.bell, commonStyles.center]}
          onPress={() => navigation.navigate("Notifications")}
        >
          <FontAwesomeIcon icon={faBell} size={20} />
          <View
            style={[
              commonStyles.center,
              {
                backgroundColor: "rgb(249 115 22)",
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
                          : post.caption.slice(0, 150) + "......."}
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
          ))
        ) : (
          <View style={commonStyles.center}>
            {feedLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={commonStyles.h4}>"No Posts Found"</Text>
            )}
          </View>
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

export default Home;
