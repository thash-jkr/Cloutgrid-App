import { View, SafeAreaView, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";

import CustomButton from "../common/CustomButton";
import JobCreate from "../common/jobCreate";
import PostCreate from "../common/postCreate";

const Create = ({ type }) => {
  const [content, setContent] = useState("post");
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setShowKeyboard(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setShowKeyboard(false)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

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
      {type === "business" && (
        <View style={{ flexDirection: "row", display: `${showKeyboard ? "none" : "flex"}` }}>
          <CustomButton title="Post" onPress={() => setContent("post")} />
          <CustomButton
            title="Collaboration"
            onPress={() => setContent("job")}
          />
        </View>
      )}

      {content === "job" ? <JobCreate /> : <PostCreate type={type} />}
    </SafeAreaView>
  );
};

export default Create;
