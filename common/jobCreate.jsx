import {
  View,
  Text,
  TextInput,
  Platform,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import axios from "axios";
import React, { useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  faArrowLeft,
  faClose,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../common/customButton";
import commonStyles from "../styles/common";
import jobsStyles from "../styles/jobs";
import Config from "../config";
import { useNavigation } from "@react-navigation/native";
import AboutModal from "../modals/aboutModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PickerModal from "../modals/pickerModal";

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
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutBody, setAboutBody] = useState("");

  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const modalizeRef = useRef(null);

  const { width } = Dimensions.get("window");

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
        navigation.navigate("MyJobs");
      }
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
      // console.log(error.response.data)
    }
  };

  const AREA_OPTIONS = [
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

  const AREA_OPTIONS_OBJECT = AREA_OPTIONS.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
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
          <Text style={commonStyles.backText}>Create Collaboration</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardOpeningTime={0}
        extraScrollHeight={50}
        contentContainerStyle={[commonStyles.centerVertical]}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.centerLeft}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Title: </Text>
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
                  "Describe the purpose of this collaboration opportunity. Share what you're promoting, your expectations, and any other important context for creators."
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
                  "List what you're looking for in a creator — such as follower count, content style, niche, or platform presence. Separate multiple requirements with commas. \n\neg: “Minimum 10k followers, Instagram Reels experience, Based in South India”"
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

        <View style={[commonStyles.centerLeft, { position: "relative" }]}>
          <View style={commonStyles.center}>
            <Text style={commonStyles.h4}>Add Questions (optional): </Text>
            <TouchableOpacity
              onPress={() => {
                setAboutTitle("Asking questions to creators!");
                setAboutBody(
                  "Add questions you want applicants to answer when they apply. These help you evaluate fit and gather more detailed responses. Use open-ended text questions for more insight. \n\nAdd a question in the given text box, then click ”Add Question” button to add the question. Likewise, you can add multiple questions"
                );
                modalizeRef.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Please add your specific question for the creators"
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
            <Text style={{ color: "blue", fontWeight: 700 }}>Add Question</Text>
          </TouchableOpacity>
        </View>

        {formData.questions.length > 0 && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              width: width * 0.9,
              marginBottom: 10,
            }}
          >
            <Text style={commonStyles.h4}>Added Questions:</Text>
            <View
              style={{
                borderWidth: 1,
                width: "100%",
                borderRadius: 10,
              }}
            >
              {formData.questions.map((question, index) => (
                <View
                  key={index}
                  style={{
                    padding: 10,
                    borderBottomWidth:
                      index !== formData.questions.length - 1 && 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ maxWidth: "90%" }}>
                    {index + 1}. {question}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newArr = formData.questions.filter(
                        (_, i) => i !== index
                      );
                      setFormData((prev) => ({
                        ...prev,
                        questions: newArr,
                      }));
                    }}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

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
                  "Set a deadline for creators to apply. After this date, the opportunity will no longer be available for new applications."
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
                  "Choose the business category or niche this collaboration falls under. This helps creators in the right domain find your post more easily."
                );
                modalizeRef.current?.open();
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={17} />
            </TouchableOpacity>
          </View>
          <Text style={{ marginRight: 10, color: "#777" }}>
            {formData.target_creator
              ? AREA_OPTIONS_OBJECT[formData.target_creator]
              : "none selected"}
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <CustomButton title={"Submit"} />
        </View>
      </KeyboardAwareScrollView>

      <AboutModal
        modalizeRef={modalizeRef}
        title={aboutTitle}
        body={aboutBody}
      />

      <Modal visible={showDateModal} transparent={true} animationType="slide">
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

      {showAreaModal && (
        <PickerModal
          pickerModal={showAreaModal}
          onClose={() => setShowAreaModal(false)}
          category={formData.target_creator}
          handleChange={handleChange}
          type={"collab"}
        />
      )}
    </View>
  );
};

export default JobCreate;
