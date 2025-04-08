import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../authentication/login";
import Register from "../authentication/register/register";
import RegisterCreator from "../authentication/register/registerCreator";
import RegisterBusiness from "../authentication/register/registerBusiness";
import ResetPassword from "../authentication/resetPassword";
import AppTabs from "./AppTabs";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterCreator" component={RegisterCreator} />
      <Stack.Screen name="RegisterBusiness" component={RegisterBusiness} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );
};

export default AuthStack;
