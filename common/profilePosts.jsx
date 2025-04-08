import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import React from "react";

import Config from "../config";

const ProfilePosts = ({ posts, onRefresh, refreshing }) => {
  const { height, width } = Dimensions.get("window");

  const renderRow = (rowPosts) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 3,
          width: width - 10
        }}
      >
        {rowPosts.map((post) => (
          <View key={post.id} style={{ marginHorizontal: 3 }}>
            <Image
              style={{ width: width / 3 - 10, height: width / 3 - 10 }}
              source={{ uri: `${Config.BASE_URL}${post.image}` }}
            />
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
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {posts.length > 0 ? (
        postsInRows.map((rowPosts, index) => (
          <React.Fragment key={index}>{renderRow(rowPosts)}</React.Fragment>
        ))
      ) : (
        <Text>No posts found.</Text>
      )}
    </ScrollView>
  );
};

export default ProfilePosts;
