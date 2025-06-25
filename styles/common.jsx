import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    width: width,
    height: height,
  },
  containerCenter: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: width,
  },
  text: {
    // fontFamily: "sen-400",
  },
  backText: {
    fontSize: 20,
    fontWeight: "600",
  },
  center: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centerVertical: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  centerLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  h1: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 8,
  },
  h2: {
    fontSize: 20,
    // fontFamily: "sen-700",
    marginVertical: 8,
    fontWeight: "600",
  },
  h3: {
    fontSize: 18,
    // fontFamily: "sen-600",
    marginVertical: 6,
  },
  h4: {
    fontSize: 16,
    // fontFamily: "sen-600",
    marginVertical: 1,
    fontWeight: "600",
  },
  h5: {
    fontSize: 14,
    // fontFamily: "sen-500",
    // marginVertical: 4,
  },
  h6: {
    fontSize: 12,
    // fontFamily: "sen-400",
    // marginVertical: 3
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
    color: "#000",
  },
  inputLarge: {
    width: width * 0.9,
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    color: "#000",
  },
  inputLargest: {
    width: width * 0.9,
    height: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    color: "#000",
  },
  picker: {
    width: width * 0.65,
    height: 20,
    color: "#000",
  },
  modalHeader: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 10,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 700,
  },
  modalBody: {
    padding: 10,
    paddingBottom: 50,
  },
  modalBodyText: {
    textAlign: "justify",
  },
  modalButton: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  displayNull: {
    textAlign: "center",
    margin: 20,
    fontWeight: "600",
    color: "#777",
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
});

export default commonStyles;
