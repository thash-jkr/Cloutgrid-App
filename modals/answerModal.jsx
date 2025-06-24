import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import jobsStyles from "../styles/jobs";
import commonStyles from "../styles/common";
import CustomButton from "../common/customButton";

const AnswerModal = ({ showAnswer, onClose, questions, answers, username }) => {
  const [current, setCurrent] = useState(0);
  const [question, setQuestion] = useState(questions[0]);
  const [answer, setAnswer] = useState(answers[0]);

  const navigation = useNavigation();

  const handleQuestion = (curr) => {
    setCurrent(curr);
    setQuestion(questions[curr]);
    setAnswer(answers[curr]);
  };

  return (
    <Modal visible={showAnswer} transparent={true} animationType="fade">
      <View style={jobsStyles.modalContainer}>
        <View style={jobsStyles.modalContent}>
          <View style={{ justifyContent: "flex-start", width: "100%" }}>
            <Text style={commonStyles.h2}>
              Question {current + 1} of {questions.length}
            </Text>
            <Text>{question.content}</Text>
            <Text style={commonStyles.h2}>Answer</Text>
            <Text>{answer.content}</Text>
          </View>
          <View style={commonStyles.centerVertical}>
            <View style={commonStyles.center}>
              <CustomButton
                title={"Previous"}
                disabled={current === 0}
                onPress={() => handleQuestion(current - 1)}
              />

              <CustomButton
                title={"Next"}
                disabled={current === questions.length - 1}
                onPress={() => handleQuestion(current + 1)}
              />
            </View>
            <View style={commonStyles.center}>
              <CustomButton
                title={"View Profile"}
                onPress={() => {
                  onClose();
                  navigation.navigate("Profiles", {
                    username: username,
                  });
                }}
              />

              <CustomButton title={"Close"} onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AnswerModal;
