import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import commonStyles from "../styles/common";
import CustomButton from "../common/customButton";

const PickerModal = ({
  pickerModal,
  onClose,
  category,
  handleChange,
  type,
}) => {
  const [selected, setSelected] = useState(category);

  const { height } = Dimensions.get("screen");

  const AREA_OPTIONS = [
    { value: "art", label: "Art and Photography" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty", label: "Beauty and Makeup" },
    { value: "business", label: "Business" },
    { value: "diversity", label: "Diversity and Inclusion" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "fashion", label: "Fashion" },
    { value: "finance", label: "Finance" },
    { value: "food", label: "Food and Beverage" },
    { value: "gaming", label: "Gaming" },
    { value: "health", label: "Health and Wellness" },
    { value: "home", label: "Home and Gardening" },
    { value: "outdoor", label: "Outdoor and Nature" },
    { value: "parenting", label: "Parenting and Family" },
    { value: "pets", label: "Pets" },
    { value: "sports", label: "Sports and Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "videography", label: "Videography" },
  ];

  return (
    <Modal visible={pickerModal} transparent={true} animationType="fade">
      <View style={commonStyles.modalContainer}>
        <View style={commonStyles.modalContent}>
          <Text style={commonStyles.h1}>Select Category</Text>

          <ScrollView
            style={{ height: height * 0.5, width: "100%" }}
            contentContainerStyle={commonStyles.centerVertical}
            showsVerticalScrollIndicator={false}
          >
            {AREA_OPTIONS.map((obj) => (
              <TouchableOpacity
                key={obj.value}
                style={{
                  padding: 10,
                  backgroundColor:
                    obj.value === selected ? "rgb(249 115 22)" : "#fff",
                  width: "100%",
                  borderBottomColor: "#ddd",
                  borderBottomWidth: 1,
                }}
                onPress={() => setSelected(obj.value)}
              >
                <Text
                  style={[
                    commonStyles.h4,
                    { color: obj.value === selected ? "#fff" : "#000" },
                  ]}
                >
                  {obj.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={commonStyles.center}>
            <CustomButton title={"Close"} onPress={onClose} />
            <CustomButton
              title={"Confirm"}
              disabled={!selected}
              onPress={() => {
                type === "creator"
                  ? handleChange("area", selected)
                  : type === "business"
                  ? handleChange("target_audience", selected)
                  : handleChange("target_creator", selected);
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PickerModal;
