import {
  Text,
  View,
  Image,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  Modal,
  Animated,
  Easing,
} from "react-native";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { useImageManipulator, SaveFormat } from "expo-image-manipulator";
import {
  faArrowLeft,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../common/customButton";
import commonStyles from "../styles/common";
import Config from "../config";
import profileStyles from "../styles/profile";
import { useSelector } from "react-redux";
import AboutModal from "../modals/aboutModal";

const MAX_SIZE_MB = 5;

const PostCreate = ({ route }) => {
  const { imageUri } = route.params;

  const { width } = Dimensions.get("screen");

  const { type } = useSelector((state) => state.auth);

  const modalizeRef = useRef(null);

  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [collab, setCollab] = useState(null);
  const [results, setResults] = useState([]);
  const [caption, setCaption] = useState("");
  const [localUri, setLocalUri] = useState(imageUri);
  const [imageModal, setImageModal] = useState(false);
  const [imageSize] = useState(new Animated.Value(width * 0.6));
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutBody, setAboutBody] = useState("");

  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const manipulator = useImageManipulator(localUri);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        Animated.timing(imageSize, {
          toValue: width * 0.1,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(imageSize, {
          toValue: width * 0.6,
          duration: 250,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  useEffect(() => {
    const compressIfNeeded = async () => {
      if (!localUri) {
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(localUri, { size: true });
      const imageSizeMB = fileInfo.size / (1024 * 1024);

      let finalUri = localUri;

      if (imageSizeMB > MAX_SIZE_MB) {
        const compressionRatio = MAX_SIZE_MB / imageSizeMB;
        const quality = Math.max(0.1, Math.min(1, compressionRatio));

        const manipulated = await manipulator.renderAsync();
        const result = await manipulated.saveAsync({
          compress: quality,
          format: SaveFormat.JPEG,
        });

        finalUri = result.localUri || result.uri;
      }

      const fileName = finalUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new Error("Failed to load image"));
        xhr.responseType = "blob";
        xhr.open("GET", finalUri, true);
        xhr.send(null);
      });

      setImage({
        uri: finalUri,
        name: fileName,
        type: fileType,
        file: blob,
      });
    };

    compressIfNeeded();
  }, [localUri]);

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageModal(false);
      setLocalUri(result.assets[0].uri);
    }
  };

  const handlePostSubmit = async () => {
    if (!caption) {
      Alert.alert("Error", "Please provide a caption.");
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
      setCollab("");
      setLocalUri("");
      Alert.alert("Post created successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while creating the post."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: 20,
          padding: 10,
        }}
      >
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
          <Text style={commonStyles.backText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setImageModal(true)}>
        <Animated.Image
          source={{ uri: localUri }}
          style={{
            width: imageSize,
            height: imageSize,
            borderWidth: 1,
            borderColor: "#ddd",
            marginVertical: 20,
          }}
        />
      </TouchableOpacity>

      <View style={commonStyles.centerVertical}>
        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Caption: </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutTitle("Adding caption in posts");
                setAboutBody(
                  "Write a short caption to accompany your post. This helps viewers understand the context of your post and adds a personal touch. \nKeep it engaging and authentic."
                );
                modalizeRef.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Write a caption"
            value={caption}
            onChangeText={(text) => setCaption(text)}
            style={commonStyles.inputLarge}
            textAlignVertical="top"
            multiline
          />
        </View>

        {type === "creator" && (
          <View style={[commonStyles.centerLeft, { position: "relative" }]}>
            <View
              style={{
                display: query.length > 0 ? "flex" : "none",
                height: 150,
                position: "absolute",
                top: -150,
                width: "90%",
                backgroundColor: "#fff",
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 5,
              }}
            >
              <ScrollView>
                {results.length > 0 ? (
                  results.map((item) => (
                    <TouchableOpacity
                      key={item.user.username}
                      style={{
                        width: width * 0.85,
                        padding: 10,
                        backgroundColor: "#CAF0F8",
                        margin: 5,
                        borderRadius: 10,
                        // shadowColor: "#000",
                        // shadowOffset: { width: 2, height: 2 },
                        // shadowOpacity: 0.5,
                        // shadowRadius: 2,
                        // elevation: 5,
                      }}
                      onPress={() => {
                        setCollab(item.user.username);
                        setQuery("");
                      }}
                    >
                      <Text style={{ fontWeight: "500" }}>
                        {item.user.username}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>No results</Text>
                )}
              </ScrollView>
            </View>

            <View style={commonStyles.center}>
              <Text style={commonStyles.h4}>Collaboration (optional): </Text>
              <TouchableOpacity
                onPress={() => {
                  setAboutTitle("Add Collaboration (optional)");
                  setAboutBody(
                    "Tag a business you collaborated with for this post. This helps you showcase real partnerships on your profile and lets businesses see your past work in action. Simply start typing to search and select a business user. \n\nYou can leave this empty if the post isn't tied to a specific collaboration."
                  );
                  modalizeRef.current?.open();
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} size={17} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder={collab ? "" : "Start typing to search..."}
              value={query}
              onChangeText={handleSearch}
              style={commonStyles.input}
              editable={!collab}
            />

            {collab && (
              <View
                style={{
                  backgroundColor: "#CAF0F8",
                  position: "absolute",
                  padding: 7,
                  borderRadius: 15,
                  top: 31,
                  left: 10,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: 600, marginRight: 5 }}>
                  {collab}
                </Text>
                <TouchableOpacity onPress={() => setCollab(null)}>
                  <FontAwesomeIcon icon={faXmark} size={14} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <CustomButton
        title="Create Post"
        onPress={handlePostSubmit}
        disabled={!localUri}
      />

      <Modal visible={imageModal} animationType="fade" transparent={true}>
        <View style={profileStyles.modalContainer}>
          <View>
            <Image
              source={{ uri: localUri }}
              style={{
                width: width * 0.9,
                height: width * 0.9,
              }}
            />
            <View style={commonStyles.center}>
              <CustomButton
                title={localUri ? "Change Image" : "Upload Image"}
                onPress={handleImageChange}
              />
              <CustomButton
                title="Close"
                onPress={() => setImageModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <AboutModal
        modalizeRef={modalizeRef}
        title={aboutTitle}
        body={aboutBody}
      />
    </KeyboardAvoidingView>
  );
};

export default PostCreate;
