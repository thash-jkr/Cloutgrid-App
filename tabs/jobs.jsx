import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Modalize } from "react-native-modalize";

import QuestionModal from "../modals/questionModal";
import CustomButton from "../common/CustomButton";
import jobsStyles from "../styles/jobs";
import Config from "../config";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import homeStyles from "../styles/home";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, handleApplication } from "../slices/jobSlice";
import Loader from "../common/loading";
import { handleBlock } from "../slices/profilesSlice";
import profileStyles from "../styles/profile";
import authStyles from "../styles/auth";
import commonStyles from "../styles/common";

const JobList = () => {
  const [id, setId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [report, setReport] = useState("");

  const modalizeRef = useRef(null);
  const aboutModalize = useRef(null);
  const dispatch = useDispatch();

  const { jobs, loading, error } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(fetchJobs());
  }, []);

  const handleApply = async () => {
    if (selectedJob?.questions.length > 0) {
      setShowQuestion(true);
    } else {
      submitApplication();
    }
  };

  const submitApplication = () => {
    dispatch(handleApplication({ id, answers }));
    setShowQuestion(false);
    setAnswers({});
    modalizeRef.current?.close();
    setId(null);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    setAnswers({});
    for (const q of job.questions) {
      setAnswers((prevState) => ({
        ...prevState,
        [q.id]: "",
      }));
    }
    modalizeRef.current?.open();
  };

  return (
    <SafeAreaView style={jobsStyles.container}>
      {/* <Loader visible={loading}/> */}
      <Text style={jobsStyles.h1}>Apply for Collaborations</Text>
      <ScrollView
        style={jobsStyles.jobs}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              dispatch(fetchJobs());
              setRefreshing(false);
            }}
          />
        }
      >
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={jobsStyles.job}
              onPress={() => handleSelectJob(job)}
            >
              <Image
                source={{
                  uri: `${job.posted_by.user.profile_photo}`,
                }}
                style={jobsStyles.jobImage}
              />
              <View>
                <Text style={jobsStyles.h2}>{job.title}</Text>
                <Text style={{ fontFamily: "sen-400" }}>
                  {job.posted_by.user.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No Jobs Found
            </Text>
          </View>
        )}
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        snapPoint={600}
        HeaderComponent={
          <View style={jobsStyles.modalHeader}>
            <Text style={jobsStyles.headerText}>Details</Text>
            <TouchableOpacity
              style={{ position: "absolute", right: 10 }}
              onPress={() => aboutModalize.current?.open()}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} size={20} />
            </TouchableOpacity>
          </View>
        }
        modalTopOffset={Platform.OS === "ios" ? 130 : 50}
      >
        {selectedJob ? (
          <ScrollView style={jobsStyles.modal}>
            <Text style={jobsStyles.h1}>{selectedJob.title}</Text>
            <View style={jobsStyles.jobDetail}>
              <Text>
                <Text style={jobsStyles.jobDetailText}>
                  Posted by: {selectedJob.posted_by.user.name}
                </Text>
              </Text>
              <Text>
                <Text style={jobsStyles.jobDetailText}>
                  Due Date: {selectedJob.due_date}
                </Text>
              </Text>
              <Text style={jobsStyles.jobDetailText}>
                Website: {selectedJob.posted_by.website}
              </Text>
            </View>
            <Text style={jobsStyles.jobData}>Job Description:</Text>
            <Text style={{ fontFamily: "sen-400" }}>
              {selectedJob.description}
            </Text>
            <Text style={jobsStyles.jobData}>Requirements:</Text>
            <View>
              {selectedJob.requirements.split(",").map((req, index) => (
                <Text key={index} style={{ fontFamily: "sen-400" }}>
                  • {req}
                </Text>
              ))}
            </View>
            <View style={jobsStyles.button}>
              <CustomButton
                title={selectedJob.is_applied ? "Applied" : "Apply"}
                onPress={handleApply}
                disabled={selectedJob.is_applied}
              />
            </View>
          </ScrollView>
        ) : (
          <Text>Please select a job to view details.</Text>
        )}
      </Modalize>

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
                    dispatch(handleBlock(selectedJob?.posted_by.user.username));
                    aboutModalize.current?.close();
                    modalizeRef.current?.close();
                    setAnswers({});
                    setSelectedJob(null);
                    setId(null);
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

      <Modal visible={reportModal} transparent={true} animationType="fade">
        <KeyboardAvoidingView
          style={profileStyles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={profileStyles.modalContent}>
            <Text style={profileStyles.modalTitle}>Report Form</Text>
            <TextInput
              style={[authStyles.input, { height: 200 }]}
              placeholder={
                "If you believe this collaboration post or business user has violated our community guidelines, please report it using this form"
              }
              placeholderTextColor={"#999"}
              textAlign="justify"
              value={report}
              onChangeText={(value) => setReport(value)}
              multiline
            />
            <View style={commonStyles.center}>
              <CustomButton
                title={"Close"}
                onPress={() => setReportModal(false)}
              />
              <CustomButton
                title={"Submit"}
                disabled={report.length < 1}
                onPress={() => {
                  setReport("");
                  setReportModal(false);
                  Alert.alert(
                    "Request Received",
                    "Thank you for reaching out. Our support team has received your message and will take necessary actions"
                  );
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {showQuestion && (
        <QuestionModal
          job={selectedJob}
          showQuestion={showQuestion}
          onClose={() => setShowQuestion(false)}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={submitApplication}
        />
      )}
    </SafeAreaView>
  );
};

export default JobList;
