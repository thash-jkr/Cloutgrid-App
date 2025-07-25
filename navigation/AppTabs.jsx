import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions } from "react-native";
import Home from "../tabs/home";
import Profile from "../tabs/profile";
import Search from "../tabs/search";
import Jobs from "../tabs/jobs";
import Create from "../tabs/create";
import { Ionicons } from "@expo/vector-icons";
import Profiles from "../common/profiles";
import Notifications from "../common/notifications";
import Settings from "../common/settings";
import Comments from "../common/comments";
import ProfilePostsDetails from "../common/profilePostsDetails";
import MyJobs from "../tabs/myJobs";

import JobCreate from "../common/jobCreate";
import PostCreate from "../common/postCreate";
import { useSelector } from "react-redux";
import JobDetails from "../common/jobDetails";
import EditProfile from "../common/editProfile";
import JobApplications from "../common/jobApplications";
import PostDetail from "../common/postDetail";
import JobQuestions from "../common/jobQuestions";
import JobAnswers from "../common/jobAnswers";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const { height, width } = Dimensions.get("window");

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Profiles" component={Profiles} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen
        name="ProfilePostsDetails"
        component={ProfilePostsDetails}
      />
      <Stack.Screen name="PostDetail" component={PostDetail} />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={Search} />
      <Stack.Screen name="Profiles" component={Profiles} />
    </Stack.Navigator>
  );
};

const CreateStack = ({ type }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateMain">
        {(props) => <Create {...props} type={type} />}
      </Stack.Screen>
      <Stack.Screen name="JobCreate" component={JobCreate} />
      <Stack.Screen name="PostCreate" component={PostCreate} />
    </Stack.Navigator>
  );
};

const CreatorJobStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsMain" component={Jobs} />
      <Stack.Screen name="JobDetails" component={JobDetails} />
      <Stack.Screen name="JobQuestions" component={JobQuestions} />
      <Stack.Screen name="Profiles" component={Profiles} />
    </Stack.Navigator>
  );
};

const BusinessJobStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyJobsMain" component={MyJobs} />
      <Stack.Screen name="Profiles" component={Profiles} />
      <Stack.Screen name="Applications" component={JobApplications} />
      <Stack.Screen name="JobAnswers" component={JobAnswers} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="ProfilePostsDetails"
        component={ProfilePostsDetails}
      />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  const type = useSelector((state) => state.auth.type);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Jobs") {
            iconName = "briefcase";
          } else if (route.name === "Create") {
            iconName = "add-circle";
          } else if (route.name === "MyJobs") {
            iconName = "briefcase";
          }
          return <Ionicons name={iconName} size={width * 0.05} color={color} />;
        },
        tabBarActiveTintColor: "#03045E",
        tabBarInactiveTintColor: "#0077B6",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#ddd",
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        navigationBarColor: "#fff",
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Create" children={() => <CreateStack type={type} />} />
      {type === "creator" && (
        <Tab.Screen name="Jobs" component={CreatorJobStack} />
      )}
      {type === "business" && (
        <Tab.Screen name="MyJobs" component={BusinessJobStack} />
      )}
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default AppTabs;
