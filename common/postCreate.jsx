import {
  View,
  Text,
  Alert,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Modalize } from "react-native-modalize";

import jobsStyles from "../styles/jobs";
import CustomButton from "../common/CustomButton";
import Config from "../config";
import commonStyles from "../styles/common";

const PostCreate = ({ type }) => {
  const [query, setQuery] = useState(null);
  const [image, setImage] = useState(null);
  const [collab, setCollab] = useState(null);
  const [results, setResults] = useState([]);
  const [caption, setCaption] = useState("");
  const [filename, setFilename] = useState("no file selected!");

  const navigation = useNavigation();
  const modalizeRef = useRef(null);

  const handleSearch = async (q) => {
    setQuery(q);

    if (q.length > 1) {
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/search-business?q=${q}`
        );
        if (response.data) {
          setResults(response.data);
        }
      } catch (error) {
        Alert.alert("Error", "Error fetching businesses");
      }
    } else {
      setResults([]);
    }
  };

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      const localUri = result.assets[0]["uri"];
      const fileName = localUri.split("/").pop();
      setFilename(fileName);
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error("Failed to load image"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", localUri, true);
        xhr.send(null);
      });

      setImage({
        uri: localUri,
        name: fileName,
        type: fileType,
        file: blob,
      });
    }
  };

  const handlePostSubmit = async () => {
    if (!caption || !image) {
      Alert.alert("Please provide both an image and a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
    }
    formData.append("collaboration", collab);

    try {
      const access = await SecureStore.getItemAsync("access");
      await axios.post(`${Config.BASE_URL}/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCaption("");
      setImage(null);
      setFilename("no file selected!");
      setCollab(null);
      Alert.alert("Post created successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <SafeAreaView style={jobsStyles.container}>
      <Text style={jobsStyles.h1}>Create a Post</Text>

      <View
        style={{
          marginVertical: 10,
          paddingVertical: 20,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
          borderTopColor: "#ddd",
          borderTopWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
            marginBottom: 15,
          }}
        >
          <CustomButton title={"Select Image"} onPress={handleImageChange} />
          <Text style={commonStyles.text}>
            {filename.length > 20
              ? filename.substring(0, 20) + "..."
              : filename}
          </Text>
        </View>

        <TextInput
          placeholder="Write a caption..."
          value={caption}
          onChangeText={(text) => setCaption(text)}
          style={jobsStyles.input}
        />

        {type === "creator" && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
            }}
          >
            <CustomButton
              title={"Select collab"}
              onPress={() => modalizeRef.current?.open()}
            />
            {collab ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{collab}</Text>
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={() => setCollab(null)}
                >
                  <FontAwesomeIcon icon={faX} size={10} />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={[commonStyles.text, { maxWidth: 150, textAlign: "right" }]}>
                If you are collabing with a business for this post, you can add
                them here (optional)
              </Text>
            )}
          </View>
        )}
      </View>
      
      <CustomButton title="Create Post" onPress={handlePostSubmit} />

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        HeaderComponent={
          <View style={jobsStyles.modalHeader}>
            <Text style={jobsStyles.headerText}>Search for businesses</Text>
          </View>
        }
      >
        <View style={jobsStyles.modal}>
          <TextInput
            placeholder="Search for businesses..."
            style={jobsStyles.input}
            value={query}
            onChangeText={handleSearch}
          />
          {results.length > 0 ? (
            results.map((item) => (
              <TouchableOpacity
                key={item.user.username}
                style={jobsStyles.job}
                onPress={() => {
                  setCollab(item.user.username);
                  modalizeRef.current?.close();
                }}
              >
                <Image
                  source={{
                    uri: `${Config.BASE_URL}${item.user.profile_photo}`,
                  }}
                  style={jobsStyles.jobImage}
                />
                <Text>{item.user.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No results</Text>
          )}
          <View style={jobsStyles.button}>
            <CustomButton
              title={"Close"}
              onPress={() => modalizeRef.current?.close()}
            />
          </View>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

export default PostCreate;
