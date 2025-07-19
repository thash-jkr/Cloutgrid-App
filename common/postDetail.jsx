import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import commonStyles from "../styles/common";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faCircleUp,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import homeStyles from "../styles/home";
import Triangle from "./triangle";
import {
  faSquare,
  faCircleUp as unlike,
} from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { likePost, selectPostById } from "../slices/feedSlice";

const PostDetail = ({ route }) => {
  const { id } = route.params;
  const post = useSelector((state) => selectPostById(state, id));

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const aboutModalize = useRef(null);
  const lastTapRef = useRef(null);
  const dispatch = useDispatch();

  const handleTap = (post) => {
    const now = new Date().getTime();
    const delay = 300;

    if (now - lastTapRef.current < delay) {
      handleLike(post.id);
    }

    lastTapRef.current = now;
  };

  const handleLike = (id) => {
    dispatch(likePost(id));
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
          <Image
            style={homeStyles.profilePicture}
            source={{
              uri: `${post.author.profile_photo}`,
            }}
          />
          <Text style={homeStyles.postAuthor}>{post.author.name}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={homeStyles.post}>
          <TouchableWithoutFeedback onPress={() => !post.is_liked && handleTap(post)}>
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
                onPress={() => navigation.navigate("Comments", { post: post })}
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
      </ScrollView>
    </View>
  );
};

export default PostDetail;
