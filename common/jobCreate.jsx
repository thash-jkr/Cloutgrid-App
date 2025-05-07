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
} from "react-native";
import axios from "axios";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import CustomButton from "../common/CustomButton";
import commonStyles from "../styles/common";
import jobsStyles from "../styles/jobs";
import authStyles from "../styles/auth";
import Config from "../config";
import { useNavigation } from "@react-navigation/native";

const JobCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medium: "",
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

  const navigation = useNavigation();

  const { width } = Dimensions.get("window");

  const nextStep = () => setCurrentStep(currentStep + 1);
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
        navigation.navigate("MyJobs")
      }
    } catch (error) {
      console.error("Error creating job:", error);
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
          style={commonStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={jobsStyles.h1}>Create a Collaboration</Text>
          <TextInput
            style={authStyles.input}
            placeholder="Title"
            value={formData.title}
            onChangeText={(value) => handleChange("title", value)}
          />

          <TextInput
            style={authStyles.input}
            placeholder="Description"
            value={formData.description}
            onChangeText={(value) => handleChange("description", value)}
          />

          <TextInput
            style={authStyles.input}
            placeholder="Requirements (seperated by coma ',')"
            value={formData.requirements}
            onChangeText={(value) => handleChange("requirements", value)}
          />
          <CustomButton title={"Continue"} onPress={nextStep} />
        </KeyboardAvoidingView>
      );
    case 2:
      return (
        <KeyboardAvoidingView
          style={commonStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={jobsStyles.h1}>Additional Information</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: width * 0.95,
              marginBottom: 15,
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
              borderTopColor: "#ddd",
              borderTopWidth: 1,
            }}
          >
            <CustomButton
              title={"Questions"}
              onPress={() => setShowQuestionModal(true)}
            />
            <Text style={{ marginRight: 10, fontFamily: "sen-400" }}>
              {formData.questions.length} questions
            </Text>
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
            <CustomButton
              title={"Due Date"}
              onPress={() =>
                Platform.OS === "ios"
                  ? setShowDateModal(true)
                  : setShowDatePicker(true)
              }
            />
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
            <CustomButton
              title={"Target Audience"}
              onPress={() => setShowAreaModal(true)}
            />
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
            <KeyboardAvoidingView
              style={jobsStyles.modalContainer}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={jobsStyles.modalContent}>
                <Text style={jobsStyles.modalTitle}>
                  Add Questions (optional)
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    style={[
                      authStyles.input,
                      { width: "85%", marginBottom: 0 },
                    ]}
                    placeholder="Add questions here"
                    value={question}
                    onChangeText={(value) => setQuestion(value)}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      formData.questions.push(question);
                      setQuestion("");
                    }}
                    disabled={question.length === 0}
                  >
                    <FontAwesomeIcon icon={faCirclePlus} size={40} />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={{ width: "95%", maxHeight: 200 }}
                  showsVerticalScrollIndicator={false}
                >
                  {formData.questions.length > 0 &&
                    formData.questions.map((q, key) => (
                      <Text
                        key={key}
                        style={{ fontFamily: "sen-400", margin: 5 }}
                      >
                        {`\u2022 ${q}`}
                      </Text>
                    ))}
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
            </KeyboardAvoidingView>
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
        </KeyboardAvoidingView>
      );
    default:
      return null;
  }

  // return (
  //   <View style={jobsStyles.container}>
  //     <Text style={jobsStyles.h1}>Create a Collaboration</Text>
  //     <TextInput
  //       style={authStyles.input}
  //       placeholder="Title"
  //       value={formData.title}
  //       onChangeText={(value) => handleChange("title", value)}
  //     />

  //     <TextInput
  //       style={authStyles.input}
  //       placeholder="Description"
  //       value={formData.description}
  //       onChangeText={(value) => handleChange("description", value)}
  //     />

  //     <TextInput
  //       style={authStyles.input}
  //       placeholder="Requirements"
  //       value={formData.requirements}
  //       onChangeText={(value) => handleChange("requirements", value)}
  //     />

  //     <View style={authStyles.buttonInput}>
  //       <CustomButton
  //         title={"Questions"}
  //         onPress={() => setShowQuestionModal(true)}
  //       />
  //       <Text style={{ marginRight: 10, fontFamily: "sen-400" }}>
  //         {formData.questions.length} questions
  //       </Text>
  //     </View>

  //     <View style={authStyles.buttonInput}>
  //       <CustomButton
  //         title={"Target Audience"}
  //         onPress={() => setShowAreaModal(true)}
  //       />
  //       <Text style={{ marginRight: 10 }}>{formData.target_creator}</Text>
  //     </View>

  //     <Modal
  //       visible={showQuestionModal}
  //       transparent={true}
  //       animationType="fade"
  //     >
  //       <View style={jobsStyles.modalContainer}>
  //         <View style={jobsStyles.modalContent}>
  //           <Text style={jobsStyles.modalTitle}>Add Questions (optional)</Text>
  //           <View
  //             style={{
  //               flexDirection: "row",
  //               justifyContent: "space-around",
  //               alignItems: "center",
  //               width: "100%",
  //               marginBottom: 10,
  //             }}
  //           >
  //             <TextInput
  //               style={[authStyles.input, { width: "85%", marginBottom: 0 }]}
  //               placeholder="Add questions here"
  //               value={question}
  //               onChangeText={(value) => setQuestion(value)}
  //             />
  //             <TouchableOpacity
  //               onPress={() => {
  //                 formData.questions.push(question);
  //                 setQuestion("");
  //               }}
  //               disabled={question.length === 0}
  //             >
  //               <FontAwesomeIcon icon={faCirclePlus} size={40} />
  //             </TouchableOpacity>
  //           </View>
  //           <ScrollView
  //             style={{ width: "95%", maxHeight: 200 }}
  //             showsVerticalScrollIndicator={false}
  //           >
  //             {formData.questions.length > 0 &&
  //               formData.questions.map((q, key) => (
  //                 <Text key={key} style={{ fontFamily: "sen-400", margin: 5 }}>
  //                   {`\u2022 ${q}`}
  //                 </Text>
  //               ))}
  //           </ScrollView>
  //           <View style={commonStyles.center}>
  //             <CustomButton
  //               title={"Close"}
  //               onPress={() => setShowQuestionModal(false)}
  //             />
  //             <CustomButton
  //               title={"Reset"}
  //               onPress={() => {
  //                 setFormData((prevState) => ({
  //                   ...prevState,
  //                   questions: [],
  //                 }));
  //                 setQuestion("");
  //               }}
  //             />
  //           </View>
  //         </View>
  //       </View>
  //     </Modal>

  //     <Modal visible={showAreaModal} transparent={true} animationType="fade">
  //       <View style={jobsStyles.modalContainer}>
  //         <View style={jobsStyles.modalContent}>
  //           <Text style={jobsStyles.modalTitle}>
  //             Select your target audience
  //           </Text>
  //           <Picker
  //             selectedValue={formData.target_creator}
  //             style={jobsStyles.picker}
  //             onValueChange={(value) => {
  //               handleChange("target_creator", value);
  //             }}
  //           >
  //             {AREA_CHOICES.map((option) => (
  //               <Picker.Item
  //                 key={option.value}
  //                 label={option.label}
  //                 value={option.value}
  //               />
  //             ))}
  //           </Picker>
  //           <CustomButton
  //             title="Close"
  //             onPress={() => setShowAreaModal(false)}
  //           />
  //         </View>
  //       </View>
  //     </Modal>
  //     <CustomButton title="Create Job" onPress={handleSubmit} />
  //   </View>
  // );
};

export default JobCreate;
