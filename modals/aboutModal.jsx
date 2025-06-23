import { View, Text } from "react-native";
import React from "react";
import { Modalize } from "react-native-modalize";
import commonStyles from "../styles/common";

const AboutModal = ({ modalizeRef, title, body }) => {
  return (
    <Modalize
      ref={modalizeRef}
      adjustToContentHeight={true}
      HeaderComponent={
        <View style={commonStyles.modalHeader}>
          <Text style={commonStyles.modalHeaderText}>{title}</Text>
        </View>
      }
    >
      <View style={commonStyles.modalBody}>
        <Text style={commonStyles.modalBodyText}>{body}</Text>
      </View>
    </Modalize>
  );
};

export default AboutModal;
