import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import commonStyles from "../styles/common";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomButton from "./customButton";
import { useDispatch } from "react-redux";
import { handleApplication } from "../slices/jobSlice";

const JobQuestions = ({ route }) => {
  const [answers, setAnswers] = useState({});

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { width } = Dimensions.get("screen");

  const { job } = route.params;

  useEffect(() => {
    for (const q of job.questions) {
      setAnswers((prevState) => ({
        ...prevState,
        [q.id]: "",
      }));
    }
  }, []);

  const handleSubmit = () => {
    for (let q of job.questions) {
      if (answers[q.id].length === 0) {
        Alert.alert("Error", "Please answer all questions before submitting.");
        return;
      }
    }

    dispatch(handleApplication({ id: job.id, answers }))
      .unwrap()
      .then(() => {
        Alert.alert(
          "Success",
          "Your application has been submitted successfully."
        );
        navigation.navigate("JobsMain");
      })
      .catch((error) => Alert.alert("Error", error));
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#fff" />
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
          <Text style={commonStyles.backText}>Questions</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardOpeningTime={0}
        extraScrollHeight={Platform.OS === "ios" ? 50 : 200}
        contentContainerStyle={[commonStyles.centerVertical]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: width, borderBottomWidth: 0.5 }}>
          <Text style={{ margin: 10, fontSize: 14 }}>
            Answer the following questions to apply for this collaboration
            opportunity:
          </Text>
        </View>

        <View style={commonStyles.centerVertical}>
          {job.questions?.map((question, id) => (
            <View
              key={question.id}
              style={[
                commonStyles.centerVertical,
                { borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
              ]}
            >
              <View style={[commonStyles.centerLeft, { width: width }]}>
                <Text style={{ marginHorizontal: 20, marginVertical: 5 }}>
                  {id + 1}. {question.content}
                </Text>
              </View>
              <TextInput
                style={commonStyles.inputLarge}
                placeholder="Enter a detailed answer to increase your chances of getting hired"
                placeholderTextColor={"#777"}
                value={answers[question.id]}
                onChangeText={(value) =>
                  setAnswers((prevState) => ({
                    ...prevState,
                    [question.id]: value,
                  }))
                }
                textAlignVertical="top"
                multiline
              />
            </View>
          ))}
        </View>

        <View style={{ marginBottom: 50 }}>
          <CustomButton title={"Submit"} onPress={handleSubmit} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default JobQuestions;
