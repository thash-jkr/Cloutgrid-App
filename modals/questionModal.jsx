import React, { useState } from "react";
import {
  Modal,
  View,
  ScrollView,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import CustomButton from "../common/customButton";
import jobsStyles from "../styles/jobs";
import commonStyles from "../styles/common";

const QuestionModal = ({
  job,
  showQuestion,
  onClose,
  answers,
  setAnswers,
  onSubmit,
}) => {
  const [current, setCurrent] = useState(0);
  const [question, setQuestion] = useState(job.questions[0]);

  const handleQuestion = (curr) => {
    setCurrent(curr);
    setQuestion(job.questions[curr]);
  };

  const handleAnswer = (value) => {
    setAnswers((prevState) => ({
      ...prevState,
      [question.id]: value,
    }));
  };

  return (
    <Modal visible={showQuestion} transparent={true} animationType="fade">
      <KeyboardAvoidingView
        style={jobsStyles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={jobsStyles.modalContent}>
          <ScrollView>
            <Text style={jobsStyles.modalTitle}>{question.content}</Text>
          </ScrollView>
          <TextInput
            style={[commonStyles.input, { height: 100 }]}
            placeholder="Give your answer here...!"
            value={answers[question.id]}
            onChangeText={(value) => handleAnswer(value)}
            textAlignVertical="top"
            multiline
          />
          <View style={[commonStyles.center, { width: "100%" }]}>
            <CustomButton title="Close" onPress={onClose} />
            <CustomButton
              title="Previous"
              disabled={current === 0}
              onPress={() => handleQuestion(current - 1)}
            />
            <CustomButton
              title="Next"
              disabled={
                answers[question.id].length === 0 ||
                current === job.questions.length - 1
              }
              onPress={() => handleQuestion(current + 1)}
            />
            <CustomButton
              title="Submit"
              disabled={
                current !== job.questions.length - 1 ||
                answers[question.id].length === 0
              }
              onPress={onSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default QuestionModal;
