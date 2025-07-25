import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../slices/jobSlice";
import commonStyles from "../styles/common";
import jobsStyles from "../styles/jobs";
import Loader from "../common/loading";

const JobList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const { jobs, jobLoading } = useSelector((state) => state.job);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchJobs());
    setLoading(false);
  }, []);

  return (
    <View style={[commonStyles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#fff" />
      <Loader visible={loading} />
      <View
        style={[
          commonStyles.center,
          { borderBottomWidth: 0.5, borderBottomColor: "#ddd", width: "100%" },
        ]}
      >
        <Text style={commonStyles.h1}>Apply for Collaborations</Text>
      </View>
      <ScrollView
        style={jobsStyles.jobs}
        showsVerticalScrollIndicator={false}
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
              onPress={() => {
                navigation.navigate("JobDetails", { job: job });
              }}
            >
              <Image
                source={{
                  uri: `${job.posted_by.user.profile_photo}`,
                }}
                style={jobsStyles.jobImage}
              />
              <View>
                <Text style={jobsStyles.h2}>{job.title}</Text>
                <Text style={commonStyles.h6}>{job.posted_by.user.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={commonStyles.center}>
            {jobLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={commonStyles.h4}>
                No New Collaborations Available
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default JobList;
