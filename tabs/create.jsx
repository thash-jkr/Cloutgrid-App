import { View, Text, Dimensions, Platform } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import CustomButton from "../common/customButton";
import commonStyles from "../styles/common";
import { useNavigation } from "@react-navigation/native";

const Create = ({ type }) => {
  const navigation = useNavigation();

  const { height, width } = Dimensions.get("window");

  const insets = useSafeAreaInsets();

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate("PostCreate", {
        imageUri: result.assets[0].uri,
      });
    }
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <Text style={commonStyles.h1}>Create</Text>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            padding: 10,
            backgroundColor: "#fff",
            margin: 5,
            borderRadius: 10,
            alignItems: "flex-start",
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 5,
            width: width * 0.95,
          }}
        >
          <View>
            <CustomButton title={"Post"} onPress={handleImageChange} />
          </View>

          <View>
            {type === "creator" ? (
              <Text
                style={{
                  fontFamily: "sen-400",
                  textAlign: "justify",
                  color: "#555",
                }}
              >
                Upload an image from a previous brand collaboration or campaign
                you've been part of. This helps businesses understand your
                content style and reach — and increases your chances of getting
                hired.
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: "sen-400",
                  textAlign: "justify",
                  color: "#555",
                }}
              >
                Share visuals from previous influencer campaigns or highlight
                your products/services. This helps creators discover your brand
                and builds trust for future partnerships.
              </Text>
            )}
          </View>
        </View>

        {type === "business" && (
          <View
            style={{
              padding: 10,
              backgroundColor: "#fff",
              margin: 5,
              borderRadius: 10,
              alignItems: "flex-start",
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 5,
              width: width * 0.95,
            }}
          >
            <View>
              <CustomButton
                title={"Collaboration"}
                onPress={() => navigation.navigate("JobCreate")}
              />
            </View>
            <Text
              style={{
                fontFamily: "sen-400",
                textAlign: "justify",
                color: "#555",
              }}
            >
              Post a collaboration opportunity to connect with creators who
              match your brand. Set your requirements, ask screening questions,
              and choose the best creator for your next paid promotion.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Create;
