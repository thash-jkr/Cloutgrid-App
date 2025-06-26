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
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

import Config from "../config";
import commonStyles from "../styles/common";
import { useSelector } from "react-redux";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

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
        if (user.username === item.user.username) {
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
      <Text style={searchStyles.resultText}>{item.user.name}</Text>
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

  return (
    <SafeAreaView style={searchStyles.container}>
      <TextInput
        style={commonStyles.input}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={"#888"}
      />

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
          <View style={commonStyles.center}>
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
      />
    </SafeAreaView>
  );
};

export default Search;
