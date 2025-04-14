import React, { useState } from "react";
import {
  Modal,
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import CustomButton from "../common/CustomButton";
import jobsStyles from "../styles/jobs";

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
    <Modal visible={showQuestion} transparent={true} animationType="slide">
      <View style={jobsStyles.modalContainer}>
        <KeyboardAvoidingView
          style={jobsStyles.modalContent}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={1}
        >
          <TouchableOpacity
            style={{ position: "absolute", right: 10, top: 10 }}
            onPress={onClose}
          >
            <FontAwesomeIcon icon={faXmark} size={20} />
          </TouchableOpacity>
          <ScrollView>
            <Text style={jobsStyles.modalTitle}>{question.content}</Text>
          </ScrollView>
          <TextInput
            style={jobsStyles.input}
            placeholder="Give your answer here...!"
            value={answers[question.id]}
            onChangeText={(value) => handleAnswer(value)}
          />
          <View style={{ flexDirection: "row" }}>
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
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default QuestionModal;
