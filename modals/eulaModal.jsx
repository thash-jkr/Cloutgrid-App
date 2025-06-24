import { View, Text, ScrollView, Modal } from "react-native";
import React from "react";
import CustomButton from "../common/customButton";
import profileStyles from "../styles/profile";

const EulaModal = ({ eulaModal, onClose }) => {
  return (
    <Modal visible={eulaModal} transparent={true} animationType="fade">
      <View style={profileStyles.modalContainer}>
        <View style={profileStyles.modalContent}>
          <Text style={profileStyles.modalTitle}>
            End User License Agreement (EULA)
          </Text>
          <ScrollView style={{ padding: 10, maxHeight: 400 }}>
            <Text style={{ fontStyle: "italic", marginBottom: 16 }}>
              Effective Date: May 28, 2025
            </Text>

            <Text style={{ marginBottom: 16 }}>
              IMPORTANT: PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING
              CLOUTGRID. BY CREATING AN ACCOUNT OR ACCESSING THE APP, YOU AGREE
              TO BE BOUND BY THE TERMS OF THIS AGREEMENT. IF YOU DO NOT AGREE,
              DO NOT USE THE APP.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              1. License Grant
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutivity Private Limited ("Company", "we", "our") grants you
              ("User", "you") a limited, non-exclusive, non-transferable,
              revocable license to use Cloutgrid for your personal or business
              use in accordance with this Agreement.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              2. Ownership
            </Text>
            <Text style={{ marginBottom: 16 }}>
              All content, code, and data within Cloutgrid remain the exclusive
              property of Cloutivity Private Limited. You are granted a license
              to use Cloutgrid but not ownership of any of its components.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              3. User-Generated Content
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutgrid allows users to upload content such as posts, comments,
              messages, and profile details ("User Content"). By submitting User
              Content, you agree to the following:
              {"\n"}- You are solely responsible for all content you post or
              share.
              {"\n"}- You will not submit any content that is abusive,
              threatening, discriminatory, harassing, defamatory, obscene,
              illegal, or otherwise objectionable.
              {"\n"}- You grant Cloutivity Private Limited a non-exclusive,
              worldwide, royalty-free license to use, host, store, display, and
              distribute your User Content for the purpose of operating and
              improving the platform.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              4. Community Standards & No Tolerance Policy
            </Text>
            <Text style={{ marginBottom: 16 }}>
              By using Cloutgrid, you agree to:
              {"\n"}- Abide by our Community Guidelines, which prohibit hate
              speech, explicit content, impersonation, spam, harassment, and
              abusive behavior.
              {"\n"}- Understand that Cloutgrid enforces a zero-tolerance policy
              toward objectionable content or abusive users.
              {"\n"}- Not exploit, manipulate, or interfere with the platform or
              other users.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              5. Moderation & Reporting
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutgrid includes the following content moderation systems:
              {"\n"}- Automated and manual filtering of objectionable content.
              {"\n"}- Flagging mechanism allowing users to report content or
              behavior that violates community guidelines.
              {"\n"}- Review and enforcement, where reported content may be
              reviewed, removed, and action taken against violators, including
              warnings, suspensions, or permanent bans.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              6. Account Termination
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutgrid reserves the right to suspend or terminate your account
              without prior notice if you violate this EULA, engage in abusive
              behavior, or post objectionable content.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              7. Disclaimer & Limitation of Liability
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutgrid is provided “as is.” We do not guarantee that it will be
              error-free or uninterrupted. To the maximum extent permitted by
              law, Cloutivity Private Limited disclaims all liability for
              damages arising from your use of the app, including loss of data,
              profits, or exposure to objectionable content.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              8. Updates and Modifications
            </Text>
            <Text style={{ marginBottom: 16 }}>
              We may update this EULA from time to time. Continued use of
              Cloutgrid after such changes constitutes your acceptance of the
              revised terms.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              9. Governing Law
            </Text>
            <Text style={{ marginBottom: 16 }}>
              This Agreement shall be governed by and construed in accordance
              with the laws of India, without regard to its conflict of law
              principles.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              10. Contact
            </Text>
            <Text style={{ marginBottom: 32 }}>
              For questions or concerns, contact:
              {"\n"}Email: info@cloutgrid.com
            </Text>
          </ScrollView>
          <CustomButton title={"Close"} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default EulaModal;
