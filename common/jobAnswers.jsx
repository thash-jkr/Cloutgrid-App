import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import commonStyles from "../styles/common";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const JobAnswers = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { width } = Dimensions.get("screen");

  const { application } = route.params;

  const getQuestion = (answer) => {
    const item = application.job.questions.find(
      (question) => question.id === answer.question
    );
    return item ? item.content : "No Question Found!";
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
          <Text style={commonStyles.backText}>Answers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={commonStyles.centerVertical}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: width, borderBottomWidth: 0.5, borderBottomColor: "#777" }}>
          <Text style={{ margin: 10, fontSize: 14 }}>
            Here are the applicant's answers to this collaboration's questions.
          </Text>
        </View>

        <View style={commonStyles.centerVertical}>
          {application.answers.map((ans) => (
            <View
              key={ans.id}
              style={[
                commonStyles.centerVertical,
                { borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
              ]}
            >
              <View style={[commonStyles.centerLeft, { width: width }]}>
                <Text style={{ marginHorizontal: 20, marginVertical: 5, fontWeight: 600 }}>
                  {getQuestion(ans)}
                </Text>
              </View>
              <View
                style={{
                  width: width * 0.9,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 10,
                  marginBottom: 20,
                  minHeight: 100,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Text>{ans.content}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default JobAnswers;
