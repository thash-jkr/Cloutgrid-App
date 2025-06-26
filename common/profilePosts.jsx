import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import React from "react";

import Config from "../config";
import { useNavigation } from "@react-navigation/native";
import commonStyles from "../styles/common";
import { useSelector } from "react-redux";

const ProfilePosts = ({ posts }) => {
  const { height, width } = Dimensions.get("window");

  const profileLoading = useSelector((state) => state.profile.profileLoading);
  const profilesLoading = useSelector(
    (state) => state.profiles.profilesLoading
  );

  const navigation = useNavigation();

  const renderRow = (rowPosts) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 3,
          width: width - 10,
        }}
      >
        {rowPosts.map((post) => (
          <View key={post.id} style={{ marginHorizontal: 3 }}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("ProfilePostsDetails", { postss: posts })
              }
            >
              <Image
                style={{ width: width / 3 - 10, height: width / 3 - 10 }}
                source={{ uri: `${post.image}` }}
              />
            </TouchableWithoutFeedback>
          </View>
        ))}
      </View>
    );
  };

  const postsInRows = [];
  for (let i = 0; i < posts.length; i += 3) {
    postsInRows.push(posts.slice(i, i + 3));
  }

  return (
    <ScrollView>
      {posts.length > 0 ? (
        postsInRows.map((rowPosts, index) => (
          <React.Fragment key={index}>{renderRow(rowPosts)}</React.Fragment>
        ))
      ) : (
        <View style={commonStyles.center}>
          {profileLoading || profilesLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={commonStyles.h4}>No posts found!</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default ProfilePosts;
