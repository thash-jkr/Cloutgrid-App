import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import searchStyles from "../styles/search";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Config from "../config";
import commonStyles from "../styles/common";
import { useSelector } from "react-redux";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const user = useSelector((state) => state.auth.user);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${Config.BASE_URL}/search?q=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const renderResult = ({ item, type }) => (
    <TouchableOpacity
      style={searchStyles.searchResult}
      onPress={() => {
        setSearchQuery("");
        setSearchResults([]);
        if (user?.user.username === item.user.username) {
          navigation.navigate("Profile");
          return;
        }
        navigation.navigate("Profiles", { username: item.user.username });
      }}
    >
      <Image
        source={{
          uri: `${Config.BASE_URL}${item.user.profile_photo}`,
        }}
        style={searchStyles.searchImage}
      />
      <View style={[commonStyles.centerLeft, { marginLeft: 10 }]}>
        <Text style={{ fontWeight: 600, marginBottom: 5  }}>
          {item.user.name}
        </Text>
        <View
          style={[
            commonStyles.center,
            {
              backgroundColor: "rgb(249 115 22)",
              paddingHorizontal: 7,
              paddingVertical: 3,
              borderRadius: 12,
            },
          ]}
        >
          <Text
            style={{
              fontWeight: 600,
              fontSize: 10,
              color: "#fff",
            }}
          >
            {
              AREA_OPTIONS_OBJECT[
                item.user.user_type === "creator"
                  ? item.area
                  : item.target_audience
              ]
            }
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  let combinedResults = [];

  if (searchResults.creators) {
    combinedResults = [
      ...searchResults.creators.map((creator) => ({
        ...creator,
        type: "creator",
      })),
    ];
  }

  if (searchResults.businesses) {
    combinedResults = [
      ...combinedResults,
      ...searchResults.businesses.map((business) => ({
        ...business,
        type: "business",
      })),
    ];
  }

  const AREA_OPTIONS = [
    { value: "", label: "Select Target Audience" },
    { value: "art", label: "Art and Photography" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty and Makeup" },
    { value: "business", label: "Business" },
    { value: "diversity", label: "Diversity and Inclusion" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "fashion", label: "Fashion" },
    { value: "finance", label: "Finance" },
    { value: "food", label: "Food and Beverage" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health and Wellness" },
    { value: "home", label: "Home and Gardening" },
    { value: "outdoor", label: "Outdoor and Nature" },
    { value: "parenting", label: "Parenting and Family" },
    { value: "pets", label: "Pets" },
    { value: "sports", label: "Sports and Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "videography", label: "Videography" },
  ];

  const AREA_OPTIONS_OBJECT = AREA_OPTIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View
        style={[
          commonStyles.center,
          { borderBottomWidth: 0.5, width: "100%", borderBottomColor: "#ddd" },
        ]}
      >
        <TextInput
          style={commonStyles.input}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={"#888"}
        />
      </View>

      <FlatList
        data={combinedResults}
        keyExtractor={(item, index) => `${item.user.id}-${index}`}
        renderItem={({ item }) =>
          searchQuery.length > 0 ? (
            renderResult({ item, type: item.type })
          ) : (
            <Text style={commonStyles.h4}>
              Search for Creators and Businesses.
            </Text>
          )
        }
        ListEmptyComponent={() => (
          <View style={[commonStyles.center, { marginTop: 10 }]}>
            {loading ? (
              <ActivityIndicator />
            ) : searchQuery ? (
              <Text style={commonStyles.h4}>No users found.</Text>
            ) : (
              <Text style={commonStyles.h4}>
                Search for Creators and Businesses.
              </Text>
            )}
          </View>
        )}
        style={{ width: "100%" }}
      />
    </View>
  );
};

export default Search;
