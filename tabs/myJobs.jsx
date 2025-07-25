import {
  View,
  Text,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Modalize } from "react-native-modalize";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import jobsStyles from "../styles/jobs";
import Config from "../config";
import AnswerModal from "../modals/answerModal";
import commonStyles from "../styles/common";
import CustomButton from "../common/customButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyJobs = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicant, setApplicant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const navigation = useNavigation();

  const modalizeRef = useRef(null);

  const insets = useSafeAreaInsets();

  const fetchJobs = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.get(`${Config.BASE_URL}/jobs/my-jobs/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setJobs(response.data);
      if (response.data.length > 0) {
        setId(response.data[0].id);
        setSelectedJob(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        if (!id) {
          return;
        }
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(
          `${Config.BASE_URL}/jobs/my-jobs/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [id]);

  const handleJobDelete = async (jobId) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      await axios.delete(`${Config.BASE_URL}/jobs/${jobId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      modalizeRef.current?.close();
      setJobs(jobs.filter((job) => job.id !== jobId));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(null);
        setApplications([]);
        setId(null);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setId(job.id);
    modalizeRef.current?.open();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <View
        style={[
          commonStyles.center,
          { borderBottomWidth: 0.5, borderBottomColor: "#ddd", width: "100%" },
        ]}
      >
        <Text style={commonStyles.h1}>Your Collaborations</Text>
      </View>
      <ScrollView
        style={jobsStyles.jobs}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={jobsStyles.job}
              onPress={() =>
                navigation.navigate("Applications", {
                  id: job.id,
                })
              }
            >
              <Image
                source={{
                  uri: `${Config.BASE_URL}${job.posted_by.user.profile_photo}`,
                }}
                style={jobsStyles.jobImage}
              />
              <View>
                <Text style={jobsStyles.h2}>{job.title}</Text>
                <Text style={{ fontFamily: "sen-400" }}>
                  Due: {job.due_date}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={commonStyles.center}>
            <Text>No collaboration posted yet</Text>
          </View>
        )}
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        snapPoint={600}
        onClose={() => {
          setSelectedJob(null);
          setApplications([]);
          setId(null);
        }}
        HeaderComponent={
          <View style={jobsStyles.modalHeader}>
            <Text style={jobsStyles.headerText}>Applicants</Text>
          </View>
        }
        modalTopOffset={Platform.OS === "ios" ? 130 : 50}
      >
        {selectedJob ? (
          <ScrollView
            style={jobsStyles.modal}
            contentContainerStyle={commonStyles.centerVertical}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
                paddingBottom: 10,
                borderBottomColor: "#ddd",
                borderBottomWidth: 1,
                width: "100%",
              }}
            >
              {/* <CustomButton title={"Download Data"} disabled={applications.length === 0}/> */}
              <CustomButton
                title={"Delete Job"}
                onPress={() =>
                  Alert.alert(
                    "Delete Collaboration",
                    "Do you want to delete this collaboration? This cannot be undone!",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => handleJobDelete(selectedJob?.id),
                      },
                    ]
                  )
                }
              />
            </View>
            <View style={jobsStyles.jobs}>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <TouchableOpacity
                    key={application.id}
                    style={jobsStyles.job}
                    onPress={() => {
                      if (selectedJob.questions.length > 0) {
                        setApplicant(application.creator);
                        setShowAnswer(true);
                        setQuestions(application.job.questions);
                        setAnswers(application.answers);
                      } else {
                        navigation.navigate("Profiles", {
                          username: application.creator.user.username,
                        });
                      }
                    }}
                  >
                    <Image
                      source={{
                        uri: `${Config.BASE_URL}${application.creator.user.profile_photo}`,
                      }}
                      style={jobsStyles.jobImage}
                    />
                    <View>
                      <Text>{application.creator.user.name}</Text>
                      <Text>{application.creator.area}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={commonStyles.center}>
                  <Text>No applicants yet.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        ) : null}
      </Modalize>

      {showAnswer && (
        <AnswerModal
          showAnswer={showAnswer}
          onClose={() => setShowAnswer(false)}
          questions={questions}
          answers={answers}
          profile={applicant}
        />
      )}
    </View>
  );
};

export default MyJobs;
