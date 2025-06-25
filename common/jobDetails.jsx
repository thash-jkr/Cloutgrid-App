import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Modal,
  TextInput,
} from "react-native";
import commonStyles from "../styles/common";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Modalize } from "react-native-modalize";
import homeStyles from "../styles/home";
import jobsStyles from "../styles/jobs";
import { handleBlock } from "../slices/profilesSlice";
import CustomButton from "./customButton";
import QuestionModal from "../modals/questionModal";
import { handleApplication } from "../slices/jobSlice";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReportModal from "../modals/reportModal";

const JobDetails = ({ route }) => {
  const [report, setReport] = useState("");
  const [reportModal, setReportModal] = useState(false);
  const [questionModal, setQuestionModal] = useState(false);
  const [answers, setAnswers] = useState({});

  const { job } = route.params;

  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const aboutModalize = useRef(null);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    for (const q of job.questions) {
      setAnswers((prevState) => ({
        ...prevState,
        [q.id]: "",
      }));
    }
  }, []);

  const submitApplication = () => {
    dispatch(handleApplication({ id: job.id, answers }));
    setQuestionModal(false);
    setAnswers({});
    navigation.goBack();
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
          <Text style={commonStyles.backText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => aboutModalize.current?.open()}>
          <FontAwesomeIcon icon={faEllipsisVertical} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ width: width, padding: 20 }}>
        <Text style={[jobsStyles.h1, { textAlign: "center" }]}>
          {job.title}
        </Text>

        <View style={jobsStyles.jobDetail}>
          <Text>
            <Text style={jobsStyles.jobDetailText}>
              Posted by: {job.posted_by.user.name}
            </Text>
          </Text>
          <Text>
            <Text style={jobsStyles.jobDetailText}>
              Due Date: {job.due_date}
            </Text>
          </Text>
          <Text style={jobsStyles.jobDetailText}>
            Website: {job.posted_by.website}
          </Text>
        </View>

        <Text style={jobsStyles.jobData}>Description:</Text>
        <Text style={{ textAlign: "justify" }}>{job.description}</Text>

        <Text style={jobsStyles.jobData}>Requirements:</Text>
        <View>
          {job.requirements.split(",").map((req, index) => (
            <Text key={index}>• {req.trim()}</Text>
          ))}
        </View>

        <View style={jobsStyles.button}>
          <CustomButton
            title={job.is_applied ? "Applied" : "Apply"}
            onPress={() =>
              job?.questions.length > 0
                ? setQuestionModal(true)
                : submitApplication()
            }
            disabled={job.is_applied}
          />
        </View>
      </ScrollView>

      <Modalize
        ref={aboutModalize}
        adjustToContentHeight={true}
        HeaderComponent={
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.headerText}>About</Text>
          </View>
        }
      >
        <View style={{ padding: 10, paddingBottom: 20 }}>
          <TouchableOpacity onPress={() => setReportModal(true)}>
            <Text
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              Report Collaboration Posting
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setReportModal(true)}>
            <Text
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              Report Business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert("Block User", "Do you want to block this user?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Block",
                  style: "destructive",
                  onPress: () => {
                    dispatch(handleBlock(job?.posted_by.user.username));
                    aboutModalize.current?.close();
                    setAnswers({});
                    navigation.goBack();
                  },
                },
              ]);
            }}
          >
            <Text
              style={{
                padding: 10,
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              Block Business
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>

      {reportModal && (
        <ReportModal
          reportModal={reportModal}
          report={report}
          setReport={setReport}
          onClose={() => setReportModal(false)}
          body="If you believe this collaboration post or business user has violated our community guidelines, please report it using this form"
        />
      )}

      {questionModal && (
        <QuestionModal
          job={job}
          showQuestion={questionModal}
          onClose={() => setQuestionModal(false)}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={submitApplication}
        />
      )}
    </View>
  );
};

export default JobDetails;
