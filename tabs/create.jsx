import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import CustomButton from "../common/CustomButton";
import JobCreate from "../common/jobCreate";
import PostCreate from "../common/postCreate";
import commonStyles from "../styles/common";

const Create = ({ type }) => {
  const [content, setContent] = useState("");

  return (
    <SafeAreaView
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        flex: 1,
      }}
    >
      {content === "job" ? (
        <>
          <JobCreate />
          <View style={{ position: "absolute", top: 5, left: 10 }}>
            <TouchableOpacity onPress={() => setContent("")}>
              <FontAwesomeIcon size={25} icon={faArrowLeft} color="#03045E" />
            </TouchableOpacity>
          </View>
        </>
      ) : content === "post" ? (
        <>
          <PostCreate type={type} />
          <View style={{ position: "absolute", top: 5, left: 10 }}>
            <TouchableOpacity onPress={() => setContent("")}>
              <FontAwesomeIcon size={25} icon={faArrowLeft} color="#03045E" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View
          style={[commonStyles.container, { justifyContent: "flex-start" }]}
        >
          <Text style={commonStyles.h2}>Create</Text>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View
              style={{
                padding: 10,
                borderBottomColor: "#999",
                borderBottomWidth: 1,
                borderTopColor: "#ddd",
                borderTopWidth: 1,
              }}
            >
              <View style={{ width: "100%" }}>
                <CustomButton
                  title={"Post"}
                  onPress={() => setContent("post")}
                />
              </View>
              <View>
                {type === "creator" ? (
                  <Text
                    style={{
                      fontFamily: "sen-400",
                      width: 400,
                      textAlign: "justify",
                      color: "#555",
                    }}
                  >
                    Upload an image from a previous brand collaboration or
                    campaign you've been part of. This helps businesses
                    understand your content style and reach — and increases your
                    chances of getting hired.
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: "sen-400",
                      width: 400,
                      textAlign: "justify",
                      color: "#555",
                    }}
                  >
                    Share visuals from previous influencer campaigns or
                    highlight your products/services. This helps creators
                    discover your brand and builds trust for future
                    partnerships.
                  </Text>
                )}
              </View>
            </View>
            {type === "business" && (
              <View
                style={{
                  padding: 10,
                  borderBottomColor: "#ddd",
                  borderBottomWidth: 1,
                }}
              >
                <View style={{ width: "100%" }}>
                  <CustomButton
                    title={"Collaboration"}
                    onPress={() => setContent("job")}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "sen-400",
                    width: 400,
                    textAlign: "justify",
                    color: "#555",
                  }}
                >
                  Post a collaboration opportunity to connect with creators who
                  match your brand. Set your requirements, ask screening
                  questions, and choose the best creator for your next paid
                  promotion.
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Create;
