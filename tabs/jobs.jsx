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

const JobList = () => {
  const [id, setId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const modalizeRef = useRef(null);
  const abouModalize = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access");
        const response = await axios.get(`${Config.BASE_URL}/jobs/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [id]);

  const handleApply = async () => {
    if (selectedJob?.questions.length > 0) {
      setShowQuestion(true);
    } else {
      submitApplication();
    }
  };

  const submitApplication = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const data = {
        answers: answers,
      };

      await axios.post(`${Config.BASE_URL}/jobs/${id}/apply/`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setShowQuestion(false);
      setAnswers({});
      Alert.alert("Application Successful", "You have applied for the job.");
      modalizeRef.current?.close();
      setId(null);
    } catch (error) {
      console.error("Error applying for job:", error);
      Alert.alert("Error", "There was an error applying for the job.");
    }
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
      <Text style={jobsStyles.h1}>Apply for Collaborations</Text>
      <ScrollView style={jobsStyles.jobs}>
        {jobs &&
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
          ))}
      </ScrollView>

      <Modalize
        ref={modalizeRef}
        snapPoint={600}
        HeaderComponent={
          <View style={jobsStyles.modalHeader}>
            <Text style={jobsStyles.headerText}>Details</Text>
            <TouchableOpacity
              style={{ position: "absolute", right: 10 }}
              onPress={() => abouModalize.current?.open()}
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
        ref={abouModalize}
        adjustToContentHeight={true}
        HeaderComponent={
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.headerText}>About</Text>
          </View>
        }
      >
        <View style={{ padding: 10, paddingBottom: 20 }}>
          <TouchableOpacity>
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

          <TouchableOpacity>
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

          <TouchableOpacity>
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
