import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import commonStyles from "../styles/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import jobsStyles from "../styles/jobs";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications, handleDeleteJob } from "../slices/jobSlice";
import Loader from "./loading";
import Config from "../config";
import AnswerModal from "../modals/answerModal";
import { Modalize } from "react-native-modalize";

const JobApplications = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { id } = route.params;
  const dispatch = useDispatch();
  const [answerModal, setAnswerModal] = useState({
    visible: false,
    questions: [],
    answers: [],
    username: null,
  });
  const aboutModalize = useRef(null);

  const { applications, jobLoading, jobError } = useSelector(
    (state) => state.job
  );

  useEffect(() => {
    try {
      dispatch(fetchApplications(id));
    } catch (error) {
      Alert.alert("Error", jobError);
    }
  }, [id]);

  const AREA_OPTIONS = [
    { value: "", label: "Select Target Audience" },
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
      <Loader visible={jobLoading} />
      <View
        style={commonStyles.pageHeader}
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
          <Text style={commonStyles.backText}>Applications</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => aboutModalize.current?.open()}>
          <FontAwesomeIcon icon={faEllipsisVertical} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={jobsStyles.jobs}>
          {applications?.length > 0 ? (
            applications.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={jobsStyles.job}
                onPress={() => {
                  app.job.questions.length > 0
                    ? setAnswerModal({
                        visible: true,
                        questions: app.job.questions,
                        answers: app.answers,
                        username: app.creator.user.username,
                      })
                    : navigation.navigate("Profiles", {
                        username: app.creator.user.username,
                      });
                }}
              >
                <Image
                  source={{
                    uri: `${Config.BASE_URL}${app.creator.user.profile_photo}`,
                  }}
                  style={jobsStyles.jobImage}
                />
                <View>
                  <Text style={commonStyles.h4}>{app.creator.user.name}</Text>
                  <Text style={{ fontSize: 12 }}>
                    {AREA_OPTIONS_OBJECT[app.creator.area]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={commonStyles.center}>
              <Text style={commonStyles.displayNull}>No applications yet!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modalize
        ref={aboutModalize}
        adjustToContentHeight={true}
        HeaderComponent={
          <View style={commonStyles.modalHeader}>
            <Text style={commonStyles.modalHeaderText}>About</Text>
          </View>
        }
      >
        <View style={commonStyles.modalBody}>
          <TouchableOpacity
            style={commonStyles.modalButton}
            onPress={() => {
              try {
                dispatch(handleDeleteJob(id));
                navigation.goBack();
              } catch (error) {
                Alert.alert("Error", jobError);
              }
            }}
          >
            <Text>Delete Collaboration</Text>
          </TouchableOpacity>
        </View>
      </Modalize>

      {answerModal.visible && (
        <AnswerModal
          showAnswer={answerModal.visible}
          onClose={() => setAnswerModal({ ...AnswerModal, visible: false })}
          questions={answerModal.questions}
          answers={answerModal.answers}
          username={answerModal.username}
        />
      )}
    </View>
  );
};

export default JobApplications;
