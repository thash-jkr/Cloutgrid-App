import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  text: {
    fontFamily: "sen-400",
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
    fontSize: 32,
    fontFamily: "sen-700",
    marginVertical: 10,
  },
  h2: {
    fontSize: 28,
    fontFamily: "sen-700",
    marginVertical: 8,
  },
  h3: {
    fontSize: 24,
    fontFamily: "sen-600",
    marginVertical: 6,
  },
  h4: {
    fontSize: 20,
    fontFamily: "sen-600",
    marginVertical: 1,
  },
  h5: {
    fontSize: 18,
    fontFamily: "sen-500",
    // marginVertical: 4,
  },
  h6: {
    fontSize: 16,
    fontFamily: "sen-400",
    // marginVertical: 3
  }
});

export default commonStyles;
