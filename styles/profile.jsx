import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");

const profileStyles = StyleSheet.create({
  profile: {
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    flex: 1,
  },
  h1: {
    fontSize: 24,
    marginVertical: 10,
    textAlign: "center",
    // fontFamily: "sen-600",
    fontWeight: "600",
  },
  h2: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
    // fontFamily: "sen-500",
  },
  profileTop: {
    padding: 10,
    paddingBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.9,
  },
  profileData: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.6,
  },
  profileCount: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileBio: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: width * 0.9,
    marginTop: 20,
    marginBottom: 10,
  },
  profileArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    padding: 5,
    backgroundColor: "rgb(249 115 22)",
    borderRadius: 50,
    paddingHorizontal: 10,
    color: "#fff",
  },
  button: {
    flexDirection: "row",
  },
  profileBottom: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: width,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  footer: {
    position: "absolute",
    bottom: Platform.OS == "ios" ? 40 : 20,
    width: "100%",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 0.95 * width,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.9,
    margin: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 60
  },
  activeTab: {
    backgroundColor: "rgb(249 115 22)",
  },
  tabText: {
    fontWeight: "600",
  },
  profileSocial: {
    width: width,
    height: Platform.OS == "ios" ? height * 0.55 : height * 0.65,
    alignItems: "center",
    justifyContent: "center",
  },
  settings: {
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    height: height * 0.95,
  },
  settingsButtons: {
    width: width * 0.95,
  },
});

export default profileStyles;
