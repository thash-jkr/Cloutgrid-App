import { View, Text, ScrollView, Modal } from "react-native";
import React from "react";
import CustomButton from "../common/customButton";
import profileStyles from "../styles/profile";

const PrivacyModal = ({ privacyModal, onClose }) => {
  return (
    <Modal visible={privacyModal} transparent={true} animationType="fade">
      <View style={profileStyles.modalContainer}>
        <View style={profileStyles.modalContent}>
          <Text style={profileStyles.modalTitle}>Privacy Policy</Text>
          <ScrollView style={{ padding: 10, maxHeight: 400 }}>
            <Text style={{ fontStyle: "italic", marginBottom: 16 }}>
              Last Updated: May 28, 2025
            </Text>

            <Text style={{ marginBottom: 16 }}>
              Cloutgrid, developed and operated by Cloutivity Private Limited,
              is committed to protecting the privacy of all individuals who use
              our mobile application and web platform. This Privacy Policy
              explains how we collect, use, and safeguard personal data, as well
              as your rights in relation to this data. By accessing or using
              Cloutgrid, you consent to the practices described herein. This
              policy applies to all users, including Creator Users and Business
              Users.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Platform Purpose
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutgrid is a digital platform for collaboration between Creator
              Users and Business Users. Creators share their work and talents
              through content, while Businesses post collaboration
              opportunities, campaigns, and jobs. We are committed to protecting
              user data and enforcing standards for respectful engagement.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Data Collection
            </Text>
            <Text style={{ marginBottom: 16 }}>
              When registering, we collect your name and email address for
              account creation, communication, and recovery. You may upload
              profile images, posts, or media that become part of your public
              profile. A unique ID is assigned to each account to ensure a
              seamless experience.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Usage Data
            </Text>
            <Text style={{ marginBottom: 16 }}>
              We collect non-identifiable information such as device model, OS
              version, screen size, usage patterns, and general location (e.g.,
              city-level IP). This helps us enhance app performance and
              security.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              User Content & Moderation
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutgrid relies on user-generated content and enforces strict
              content standards to maintain a respectful and safe environment.
              We do not tolerate any content that includes nudity, sexually
              explicit material, hate speech, harassment, or graphic violence.
              Such violations will result in immediate and permanent account
              suspension. Our moderation process includes a combination of
              automated tools and manual review. Users are encouraged to report
              inappropriate content or behavior, which will be reviewed
              promptly. Repeated or severe violations will result in permanent
              removal from the platform.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Community Standards
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Creators must upload only original or licensed content and behave
              respectfully. Businesses must post only legitimate,
              non-discriminatory opportunities. All users must follow the
              Community Guidelines and EULA.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Data Usage
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Personal data is used to manage accounts, deliver services, enable
              communication, and ensure platform safety. We do not use personal
              data for targeted ads or sell it to third parties. If shared with
              providers (e.g., cloud, analytics), it is solely for platform
              functionality under strict agreements.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Data Retention
            </Text>
            <Text style={{ marginBottom: 16 }}>
              We retain data only as long as necessary to provide services or
              fulfill legal obligations. You can delete your account via
              settings or by contacting us. Data is permanently deleted unless
              legally required.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Security
            </Text>
            <Text style={{ marginBottom: 16 }}>
              We implement encryption, access controls, and secure environments.
              Still, no system is 100% secure. Use strong passwords and be
              mindful of public information.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Children’s Privacy
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Cloutgrid is not intended for children under 13. If you believe a
              child has submitted personal data, please contact us and we will
              remove it.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Your Rights
            </Text>
            <Text style={{ marginBottom: 16 }}>
              You may view, update, delete your data, or request a copy. You may
              also object to inappropriate data use. Contact us to exercise your
              rights.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Policy Updates
            </Text>
            <Text style={{ marginBottom: 16 }}>
              We may update this Privacy Policy. Significant changes will be
              communicated via in-app or email. Continued use after updates
              indicates acceptance.
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Contact Us
            </Text>
            <Text style={{ marginBottom: 32 }}>
              Cloutivity Private Limited{"\n"}Email: info@cloutgrid.com
              {"\n\n"}
              By using Cloutgrid, you agree to this Privacy Policy. Thank you
              for supporting a safe and creative community.
            </Text>
          </ScrollView>
          <CustomButton title={"Close"} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyModal;
