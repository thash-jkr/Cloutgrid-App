import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import AuthStack from "./navigation/AuthStack";
import AppTabs from "./navigation/AppTabs";
import "./interceptor/axios";
import { useFonts } from "expo-font";

export default function App() {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  
  const [auth, setAuth] = useState(false);
  const [fontsLoaded] = useFonts({
    "sen-400": require("./assets/Fonts/sen/Sen-Regular.ttf"),
    "sen-500": require("./assets/Fonts/sen/Sen-Medium.ttf"),
    "sen-600": require("./assets/Fonts/sen/Sen-SemiBold.ttf"),
    "sen-700": require("./assets/Fonts/sen/Sen-Bold.ttf"),
    "sen-800": require("./assets/Fonts/sen/Sen-ExtraBold.ttf"),
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("access");
        setAuth(!!token);
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, []);

  if (!fontsLoaded) {
    return <View />;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {auth ? <AppTabs /> : <AuthStack />}
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }
}
