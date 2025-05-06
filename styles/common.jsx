import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: width
  },
  text: {
    // fontFamily: "sen-400",
  },
  center: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  h1: {
    fontSize: 25,
    fontWeight: "700",
    // fontFamily: "sen-700",
    marginVertical: 10,
  },
  h2: {
    fontSize: 28,
    // fontFamily: "sen-700",
    marginVertical: 8,
  },
  h3: {
    fontSize: 24,
    // fontFamily: "sen-600",
    marginVertical: 6,
  },
  h4: {
    fontSize: 20,
    // fontFamily: "sen-600",
    marginVertical: 1,
  },
  h5: {
    fontSize: 18,
    // fontFamily: "sen-500",
    // marginVertical: 4,
  },
  h6: {
    fontSize: 16,
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
    // fontFamily: "sen-400",
  },
});

export default commonStyles;
