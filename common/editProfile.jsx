import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import commonStyles from "../styles/common";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import Config from "../config";
import profileStyles from "../styles/profile";
import { Picker } from "@react-native-picker/picker";
import { useImageManipulator, SaveFormat } from "expo-image-manipulator";
import CustomButton from "./customButton";
import { updateProfile } from "../slices/profileSlice";
import Loader from "./loading";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import PickerModal from "../modals/pickerModal";

const MAX_SIZE_MB = 5;

const EditProfile = () => {
  const [imageModal, setImageModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [localUri, setLocalUri] = useState("");
  const [pickerModal, setPickerModal] = useState(false);

  const manipulator = useImageManipulator(localUri);

  const { user, type } = useSelector((state) => state.auth);

  const { width } = Dimensions.get("screen");

  const dispatch = useDispatch();

  const { profileLoading, profileError } = useSelector(
    (state) => state.profile
  );

  const [formData, setFormData] =
    type === "creator"
      ? useState({
          user: {
            name: user?.user.name,
            username: user?.user.username,
            email: user?.user.email,
            password: "",
            profile_photo: null,
            bio: user?.user.bio,
          },
          area: user?.area,
        })
      : useState({
          user: {
            name: user?.user.name,
            username: user?.user.username,
            email: user?.user.email,
            password: "",
            profile_photo: null,
            bio: user?.user.bio,
          },
          website: user?.website,
          target_audience: user?.target_audience,
        });

  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

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

      setFormData((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          profile_photo: {
            uri: localUri,
            name: fileName,
            type: fileType,
            file: blob,
          },
        },
      }));
    };

    compressIfNeeded();
  }, [localUri]);

  const handleChange = (name, value) => {
    if (name === "area" || name === "website" || name === "target_audience") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [name]: value },
      }));
    }
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLocalUri(result.assets[0].uri);
    }
  };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[commonStyles.container, { paddingTop: insets.top }]}
    >
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
          <Text style={commonStyles.backText}>Edit Profile</Text>
          {profileLoading && <ActivityIndicator />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setImageModal(true)}
        style={{ position: "relative", marginTop: 10 }}
      >
        <Image
          source={{
            uri: formData.user.profile_photo
              ? formData.user.profile_photo.uri
              : `${Config.BASE_URL}${user.user.profile_photo}`,
          }}
          style={profileStyles.profilePicture}
        />
        <View
          style={[
            commonStyles.center,
            {
              position: "absolute",
              bottom: 5,
              right: 29,
              backgroundColor: "#fff",
              height: 15,
              width: 15,
              borderRadius: "50%",
            },
          ]}
        >
          <FontAwesomeIcon icon={faPenToSquare} size={10} />
        </View>
      </TouchableOpacity>

      <View style={commonStyles.centerVertical}>
        <View>
          <Text style={commonStyles.h4}>Name:</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Name"
            value={formData.user.name}
            onChangeText={(value) => handleChange("name", value)}
          />
        </View>

        <View>
          <Text style={commonStyles.h4}>Bio:</Text>
          <TextInput
            style={commonStyles.inputLarge}
            placeholder="Bio"
            value={formData.user.bio}
            onChangeText={(value) => handleChange("bio", value)}
            multiline
            textAlignVertical="top"
          />
        </View>

        {type === "business" && (
          <View>
            <Text style={commonStyles.h4}>Website:</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Website Adress"
              value={formData.website}
              onChangeText={(value) => handleChange("website", value)}
            />
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: width * 0.95,
            marginBottom: 5,
          }}
        >
          <CustomButton
            title={"Category"}
            onPress={() => setPickerModal(true)}
          />
          <Text
            style={[
              commonStyles.text,
              profileStyles.profileArea,
              { marginRight: 15 },
            ]}
          >
            {type === "creator"
              ? AREA_OPTIONS_OBJECT[formData.area]
              : AREA_OPTIONS_OBJECT[formData.target_audience]}
          </Text>
        </View>

        <View
          style={{ width: "100%", borderTopColor: "#ddd", borderTopWidth: 1 }}
        >
          <CustomButton
            title="Save"
            onPress={() => {
              dispatch(updateProfile(formData));
              if (profileError) {
                Alert.alert("Error updating profile", profileError);
              } else {
                Alert.alert("Profile Updated", "Your changes have saved!");
                navigation.goBack();
              }
            }}
          />
        </View>
      </View>

      <Modal visible={imageModal} animationType="fade" transparent={true}>
        <View style={profileStyles.modalContainer}>
          <View>
            <Image
              source={{
                uri: formData.user.profile_photo
                  ? formData.user.profile_photo.uri
                  : `${Config.BASE_URL}${user.user.profile_photo}`,
              }}
              style={{
                width: width * 0.8,
                height: width * 0.8,
                borderRadius: width * 0.4,
              }}
            />
            <View style={commonStyles.center}>
              <CustomButton title="Change Photo" onPress={handleFileChange} />
              <CustomButton
                title="Close"
                onPress={() => setImageModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {pickerModal && (
        <PickerModal
          pickerModal={pickerModal}
          onClose={() => setPickerModal(false)}
          category={
            type === "creator" ? formData.area : formData.target_audience
          }
          handleChange={handleChange}
          type={type}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
