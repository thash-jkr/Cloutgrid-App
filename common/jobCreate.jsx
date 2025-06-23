import {
  View,
  Text,
  TextInput,
  Platform,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import axios from "axios";
import React, { useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";
import {
  faArrowLeft,
  faCircleQuestion,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../common/customButton";
import commonStyles from "../styles/common";
import jobsStyles from "../styles/jobs";
import authStyles from "../styles/auth";
import Config from "../config";
import { useNavigation } from "@react-navigation/native";
import AboutModal from "../modals/aboutModal";
import profileStyles from "../styles/profile";

const JobCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    requirements: "",
    questions: [],
    target_creator: "",
  });
  const [date, setDate] = useState(new Date());
  const [question, setQuestion] = useState("");
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutBody, setAboutBody] = useState("");

  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const modalizeRef = useRef(null);

  const { width } = Dimensions.get("window");

  const nextStep = () => {
    if (!formData.title || !formData.description || !formData.requirements) {
      Alert.alert("Error", "Complete all fields to continue");
      return;
    }
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);

    handleChange("due_date", currentDate.toISOString().split("T")[0]);
  };

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.due_date || !formData.target_creator) {
      Alert.alert("Error", "You have to add a due date and target audience");
      return;
    }
    const data = new FormData();
    for (const key in formData) {
      if (key === "questions") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(`${Config.BASE_URL}/jobs/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 201) {
        alert("Job post created successfully!");
        setFormData({
          title: "",
          description: "",
          due_date: "",
          requirements: "",
          questions: "",
          target_creator: "",
        });
        setCurrentStep(1);
        navigation.navigate("MyJobs");
      }
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
      // console.log(error.response.data)
    }
  };

  const AREA_CHOICES = [
    { value: "", label: "Select your target audience" },
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

  switch (currentStep) {
    case 1:
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
              <Text style={commonStyles.backText}>Create Collaboration</Text>
            </TouchableOpacity>
          </View>

          <View style={commonStyles.centerVertical}>
            <View style={[commonStyles.centerLeft, { position: "relative" }]}>
              <View style={commonStyles.center}>
                <Text style={commonStyles.h4}>Add Questions: </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAboutTitle("Collaboration Title");
                    setAboutBody(
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    );
                    modalizeRef.current?.open();
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} size={17} />
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="Enter the title of your collaboration posting"
                value={formData.title}
                onChangeText={(value) => handleChange("title", value)}
                style={commonStyles.input}
                placeholderTextColor={"#999"}
              />
            </View>

            <View style={commonStyles.centerLeft}>
              <View style={commonStyles.center}>
                <Text style={commonStyles.h4}>Description: </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAboutTitle("Collaboration Description");
                    setAboutBody(
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    );
                    modalizeRef.current?.open();
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} size={17} />
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="Enter the collaboration description"
                value={formData.description}
                onChangeText={(value) => handleChange("description", value)}
                style={commonStyles.inputLarge}
                placeholderTextColor={"#999"}
                textAlignVertical="top"
                multiline
              />
            </View>

            <View style={commonStyles.centerLeft}>
              <View style={commonStyles.center}>
                <Text style={commonStyles.h4}>Requirements: </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAboutTitle("Collaboration Requirements");
                    setAboutBody(
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    );
                    modalizeRef.current?.open();
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} size={17} />
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="Requirements (seperated by coma ',')"
                value={formData.requirements}
                onChangeText={(value) => handleChange("requirements", value)}
                style={commonStyles.inputLarge}
                placeholderTextColor={"#999"}
                textAlignVertical="top"
                multiline
              />
            </View>
          </View>

          <CustomButton title={"Continue"} onPress={nextStep} />

          <AboutModal
            modalizeRef={modalizeRef}
            title={aboutTitle}
            body={aboutBody}
          />
        </KeyboardAvoidingView>
      );
    case 2:
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
                prevStep();
              }}
              style={commonStyles.center}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={20}
                style={{ marginRight: 20 }}
              />
              <Text style={commonStyles.backText}>Additional Information</Text>
            </TouchableOpacity>
          </View>

          <View style={commonStyles.centerVertical}>
            <View style={[commonStyles.centerLeft, { position: "relative" }]}>
              <View style={commonStyles.center}>
                <Text style={commonStyles.h4}>Add Questions: </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAboutTitle("Asking questions to creators!");
                    setAboutBody(
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    );
                    modalizeRef.current?.open();
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} size={17} />
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="Please add your specific questions for the creators"
                value={question}
                onChangeText={(value) => setQuestion(value)}
                style={commonStyles.inputLarge}
                placeholderTextColor={"#999"}
                textAlignVertical="top"
                multiline
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  bottom: 30,
                }}
                disabled={question.length === 0}
                onPress={() => {
                  formData.questions.push(question);
                  setQuestion("");
                }}
              >
                <Text style={{ color: "blue", fontWeight: 700 }}>
                  Add Question
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: width * 0.95,
                marginBottom: 10,
              }}
            >
              <CustomButton
                title={"View Questions"}
                onPress={() => setShowQuestionModal(true)}
              />
              <Text style={{ marginRight: 10, fontFamily: "sen-400" }}>
                {formData.questions.length} question(s)
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: width * 0.95,
                marginBottom: 10,
              }}
            >
              <View style={commonStyles.center}>
                <CustomButton
                  title={"Due Date"}
                  onPress={() =>
                    Platform.OS === "ios"
                      ? setShowDateModal(true)
                      : setShowDatePicker(true)
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setAboutTitle("Post Due Date");
                    setAboutBody(
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    );
                    modalizeRef.current?.open();
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} size={17} />
                </TouchableOpacity>
              </View>
              <Text style={{ marginRight: 10, color: "#777" }}>
                {formData.due_date ? formData.due_date : "Select a due date"}
              </Text>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={"spinner"}
                  onChange={handleDateChange}
                />
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: width * 0.95,
              marginBottom: 15,
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
            }}
          >
            <View style={commonStyles.center}>
              <CustomButton
                title={"Target Audience"}
                onPress={() => setShowAreaModal(true)}
              />
              <TouchableOpacity
                onPress={() => {
                  setAboutTitle("Targeting Creators");
                  setAboutBody(
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                  );
                  modalizeRef.current?.open();
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} size={17} />
              </TouchableOpacity>
            </View>
            <Text style={{ marginRight: 10, color: "#777" }}>
              {formData.target_creator
                ? formData.target_creator
                : "none selected"}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <CustomButton title="Go Back" onPress={prevStep} />
            <CustomButton title="Submit" onPress={handleSubmit} />
          </View>

          <Modal
            visible={showDateModal}
            transparent={true}
            animationType="slide"
          >
            <View style={jobsStyles.modalContainer}>
              <View style={jobsStyles.modalContent}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={"spinner"}
                  onChange={handleDateChange}
                />
                <CustomButton
                  title="Close"
                  onPress={() => setShowDateModal(false)}
                />
              </View>
            </View>
          </Modal>

          <Modal
            visible={showQuestionModal}
            transparent={true}
            animationType="fade"
          >
            <View style={profileStyles.modalContainer}>
              <View style={profileStyles.modalContent}>
                <Text style={profileStyles.modalTitle}>Questions</Text>

                <ScrollView
                  style={{ width: "95%", maxHeight: 400 }}
                  showsVerticalScrollIndicator={false}
                >
                  {formData.questions.length > 0 ? (
                    formData.questions.map((q, key) => (
                      <Text key={key} style={{ margin: 5 }}>
                        {`\u2022 ${q}`}
                      </Text>
                    ))
                  ) : (
                    <View style={[commonStyles.center]}>
                      <Text style={commonStyles.h4}>
                        You haven't added any questions yet!
                      </Text>
                    </View>
                  )}
                </ScrollView>
                <View style={commonStyles.center}>
                  <CustomButton
                    title={"Close"}
                    onPress={() => setShowQuestionModal(false)}
                  />
                  <CustomButton
                    title={"Reset"}
                    onPress={() => {
                      setFormData((prevState) => ({
                        ...prevState,
                        questions: [],
                      }));
                      setQuestion("");
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showAreaModal}
            transparent={true}
            animationType="fade"
          >
            <View style={jobsStyles.modalContainer}>
              <View style={jobsStyles.modalContent}>
                <Text style={jobsStyles.modalTitle}>
                  Select your target audience
                </Text>
                <Picker
                  selectedValue={formData.target_creator}
                  style={jobsStyles.picker}
                  onValueChange={(value) => {
                    handleChange("target_creator", value);
                  }}
                >
                  {AREA_CHOICES.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
                <CustomButton
                  title="Close"
                  onPress={() => setShowAreaModal(false)}
                />
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
    default:
      return null;
  }
};

export default JobCreate;
