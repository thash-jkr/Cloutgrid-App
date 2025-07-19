import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const jobsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: width
  },
  h1: {
    fontSize: 24,
    marginBottom: 20,
    // fontFamily: "sen-600",
    fontWeight: "700"
  },
  jobs: {
    width: width,
  },
  job: {
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  h2: {
    fontSize: 18,
    fontWeight: 600,
    maxWidth: width - 200,
  },
  modalHeader: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 10
  },
  headerText: {
    fontSize: 20,
    fontWeight: 700
    // fontFamily: "sen-700",
  },
  modal: {
    padding: 20,
    // height: height * 0.7,
    // position: "relative",
  },
  jobDetail: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  jobDetailText: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 500
    // fontFamily: "sen-500",
  },
  jobData: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 600
    // fontFamily: "sen-600",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  input: {
    width: width * 0.9,
    height: height * 0.06,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    // fontFamily: "sen-400",
  },
  picker: {
    width: width * 0.6,
    color: "#000",
  },
  jobDelete: {
    marginLeft: 10,
    position: "absolute",
    right: 30,
    top: 20,
  },
  deleteIcon: {
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.95,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "500"
    // fontFamily: "sen-500",
  },
});

export default jobsStyles;
