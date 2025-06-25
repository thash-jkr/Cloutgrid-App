import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import axios from "axios";

import AuthStack from "./navigation/AuthStack";
import AppTabs from "./navigation/AppTabs";
import "./interceptor/axios";
import { setCredentiels } from "./authentication/authSlice";
import { fetchNotifications } from "./slices/notificationSlice";

export default function App() {
  // Text.defaultProps = Text.defaultProps || {};
  // Text.defaultProps.allowFontScaling = false;

  const [rehydrated, setRehydrated] = useState(false);
  const [fontsLoaded] = useFonts({
    "sen-400": require("./assets/Fonts/sen/Sen-Regular.ttf"),
    "sen-500": require("./assets/Fonts/sen/Sen-Medium.ttf"),
    "sen-600": require("./assets/Fonts/sen/Sen-SemiBold.ttf"),
    "sen-700": require("./assets/Fonts/sen/Sen-Bold.ttf"),
    "sen-800": require("./assets/Fonts/sen/Sen-ExtraBold.ttf"),
  });

  useEffect(() => {
    (async () => {
      try {
        const [access, refresh, type, user] = await Promise.all([
          SecureStore.getItemAsync("access"),
          SecureStore.getItemAsync("refresh"),
          SecureStore.getItemAsync("type"),
          SecureStore.getItemAsync("user"),
        ]);

        if (access && refresh && type && user) {
          const userObj = JSON.parse(user);
          axios.defaults.headers.common.Authorization = `Bearer ${access}`;
          store.dispatch(
            setCredentiels({ user: userObj, token: access, refresh, type })
          );
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setRehydrated(true);
      }
    })();
  }, []);

  if (!fontsLoaded || !rehydrated) {
    return <View />;
  } else {
    return (
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <InnerApp />
        </GestureHandlerRootView>
      </Provider>
    );
  }
}

const InnerApp = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) dispatch(fetchNotifications(false));
  }, [dispatch, token]);

  return (
    <NavigationContainer>
      {token ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};
