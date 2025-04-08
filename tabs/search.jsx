import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import searchStyles from "../styles/search";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import Config from "../config";

const Search = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(`${Config.BASE_URL}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status == 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length > 1) {
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/search?q=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
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
        style={searchStyles.searchBar}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={combinedResults}
        keyExtractor={(item, index) => `${item.user.id}-${index}`}
        renderItem={({ item }) => renderResult({ item, type: item.type })}
        ListEmptyComponent={() => (
          <Text style={searchStyles.emptyText}>No users found.</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
