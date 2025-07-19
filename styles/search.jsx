import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  searchBar: {
    height: 50,
    width: width * 0.95,
    borderRadius: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    // fontFamily: "sen-400"
  },
  searchResult: {
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    width: "100%",
    borderBottomColor: "#ddd"
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    // fontFamily: "sen-500"
  },
  searchImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  resultText: {
    marginLeft: 10,
    // fontFamily: "sen-500"
  }
});

export default searchStyles;
