import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");

const homeStyles = StyleSheet.create({
  home: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  bell: {
    color: "green",
  },
  logoImage: {
    width: 40,
    height: 40,
    marginLeft: 20,
  },
  logo: {
    fontSize: 50,
    color: "#000",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sen-600",
  },
  logoSide: {
    color: "rgb(249 115 22)",
    fontFamily: "Poppins_700Bold",
  },
  h1: {
    fontSize: 40,
    // fontFamily: "sen-700",
  },
  h2: {
    fontSize: 25,
    fontFamily: "sen-600",
  },
  split: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  p: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "justify",
    fontSize: 17,
  },
  kid: {
    width: width * 0.5,
    height: width * 0.5,
    objectFit: "contain",
  },
  ccc: {
    textAlign: "center",
  },
  bars: {
    width: "100%",
  },
  bar: {
    padding: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    // backgroundColor: "#ddd"
  },
  toggle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  toggleText: {
    fontSize: 17,
    marginRight: 10,
    marginLeft: 10,
    // fontFamily: "sen-500",
  },
  postContainer: {
    // marginTop: 10,
  },
  post: {
    width: width,
    paddingBottom: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  postImage: {
    width: width,
    height: height * 0.4,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  postAuthor: {
    // fontFamily: "sen-600",
    fontWeight: "600"
  },
  postFooter: {
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  postFooterIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  postFooterText: {
    padding: 10,
    // fontFamily: "sen-400",
  },
  postFooterTextBold: {
    // fontFamily: "sen-600",
    fontSize: 15,
    fontWeight: "600"
  },
  modalHeader: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    // fontFamily: "sen-600",
  },
  modal: {
    padding: 20,
    paddingVertical: 0,
    // position: "relative",
  },
  comment: {
    padding: 10,
    borderBottomColor: "#efefef",
    borderBottomWidth: 1,
  },
  commentAuthor: {
    // fontFamily: "sen-500",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  commentInput: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    color: "#000"
  },
});

export default homeStyles;
