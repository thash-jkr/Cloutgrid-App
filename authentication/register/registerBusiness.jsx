import React, { useState } from "react";

import BasicInfo from "./registerBasicInfo";
import OtpVerification from "./registerOTP";
import AdditionalInfo from "./registerMoreInfo";

const RegisterBusiness = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    user: {
      name: "",
      email: "",
      username: "",
      profile_photo: null,
      password: "",
      bio: "",
    },
    website: "",
    target_audience: "",
  });

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleChange = (name, value) => {
    if (name === "website" || name === "target_audience") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [name]: value },
      }));
    }
  };

  switch (currentStep) {
    case 1:
      return (
        <BasicInfo
          formData={formData}
          handleChange={handleChange}
          nextStep={nextStep}
          type="business"
        />
      );
    case 2:
      return <OtpVerification nextStep={nextStep} prevStep={prevStep} />;
    case 3:
      return (
        <AdditionalInfo
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          type="business"
        />
      );
    default:
      return null;
  }
};

// const RegisterBusiness = () => {
//   const [formData, setFormData] = useState({
//     user: {
//       name: "",
//       email: "",
//       username: "",
//       profile_photo: null,
//       password: "",
//       bio: "",
//     },
//     website: "",
//     target_audience: "",
//   });
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showAreaModal, setShowAreaModal] = useState(false);
//   const navigation = useNavigation();

//   const handleChange = (name, value) => {
//     if (name === "website" || name === "target_audience") {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         user: { ...prevState.user, [name]: value },
//       }));
//     }
//   };

//   const handleFileChange = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 4],
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       const localUri = result.assets[0]["uri"];
//       const fileName = localUri.split("/").pop();
//       const match = /\.(\w+)$/.exec(fileName);
//       const fileType = match ? `image/${match[1]}` : `image`;

//       const blob = await new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//           resolve(xhr.response);
//         };
//         xhr.onerror = function () {
//           reject(new Error("Failed to load image"));
//         };
//         xhr.responseType = "blob";
//         xhr.open("GET", localUri, true);
//         xhr.send(null);
//       });

//       setFormData((prevState) => ({
//         ...prevState,
//         user: {
//           ...prevState.user,
//           profile_photo: {
//             uri: localUri,
//             name: fileName,
//             type: fileType,
//             file: blob,
//           },
//         },
//       }));
//     }
//   };

//   const handleConfirmPassword = (value) => {
//     setConfirmPassword(value);
//   };

//   const handleSubmit = async () => {
//     if (formData.user.password !== confirmPassword) {
//       Alert.alert("Passwords do not match", "Please try again.");
//       return;
//     }

//     try {
//       const data = new FormData();
//       data.append("user.name", formData.user.name);
//       data.append("user.email", formData.user.email);
//       data.append("user.username", formData.user.username);
//       data.append("user.password", formData.user.password);
//       data.append("user.bio", formData.user.bio);
//       data.append("website", formData.website);
//       data.append("target_audience", formData.target_audience);

//       if (formData.user.profile_photo) {
//         data.append("user.profile_photo", {
//           uri: formData.user.profile_photo.uri,
//           name: formData.user.profile_photo.name,
//           type: formData.user.profile_photo.type,
//         });
//       }

//       await axios.post(`${Config.BASE_URL}/register/business/`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       Alert.alert(
//         "Registration successful!",
//         "You can now log in as a business."
//       );
//       navigation.navigate("Login");
//     } catch (error) {
//       console.error("Error registering business:", error);
//     }
//   };

//   const AREA_OPTIONS = [
//     { value: "", label: "Select Target Audience" },
//     { value: "art", label: "Art and Photography" },
//     { value: "automotive", label: "Automotive" },
//     { value: "beauty", label: "Beauty and Makeup" },
//     { value: "business", label: "Business" },
//     { value: "diversity", label: "Diversity and Inclusion" },
//     { value: "education", label: "Education" },
//     { value: "entertainment", label: "Entertainment" },
//     { value: "fashion", label: "Fashion" },
//     { value: "finance", label: "Finance" },
//     { value: "food", label: "Food and Beverage" },
//     { value: "gaming", label: "Gaming" },
//     { value: "health", label: "Health and Wellness" },
//     { value: "home", label: "Home and Gardening" },
//     { value: "outdoor", label: "Outdoor and Nature" },
//     { value: "parenting", label: "Parenting and Family" },
//     { value: "pets", label: "Pets" },
//     { value: "sports", label: "Sports and Fitness" },
//     { value: "technology", label: "Technology" },
//     { value: "travel", label: "Travel" },
//     { value: "videography", label: "Videography" },
//   ];

//   return (
//     <View style={authStyles.container}>
//       <Text style={authStyles.h1}>Join as a Business</Text>
//       <TextInput
//         style={authStyles.input}
//         placeholder="Enter your name:"
//         placeholderTextColor="#767676"
//         value={formData.user.name}
//         onChangeText={(value) => handleChange("name", value)}
//       />
//       <TextInput
//         style={authStyles.input}
//         placeholder="Enter your Email:"
//         placeholderTextColor="#767676"
//         value={formData.user.email}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         onChangeText={(value) => handleChange("email", value)}
//       />
//       <TextInput
//         style={authStyles.input}
//         placeholder="Enter a username:"
//         placeholderTextColor="#767676"
//         value={formData.user.username}
//         onChangeText={(value) => handleChange("username", value)}
//       />
//       <TextInput
//         style={authStyles.input}
//         placeholder="Enter a catching bio:"
//         placeholderTextColor="#767676"
//         value={formData.user.bio}
//         onChangeText={(value) => handleChange("bio", value)}
//       />
//       <TextInput
//         style={authStyles.input}
//         placeholder="Choose a strong Password:"
//         placeholderTextColor="#767676"
//         secureTextEntry
//         value={formData.user.password}
//         onChangeText={(value) => handleChange("password", value)}
//       />
//       <TextInput
//         style={authStyles.input}
//         placeholder="Enter the password again:"
//         placeholderTextColor="#767676"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={handleConfirmPassword}
//       />
//       <TextInput
//         style={authStyles.input}
//         placeholder="Enter your website address:"
//         placeholderTextColor="#767676"
//         value={formData.website}
//         onChangeText={(value) => handleChange("website", value)}
//       />
//       <View style={authStyles.input}>
//         <TouchableOpacity onPress={handleFileChange}>
//           <Text style={{ color: "#767676" }}>Select a Profile Photo:</Text>
//         </TouchableOpacity>
//         <View style={{
//           marginLeft: "auto",
//           justifyContent: "center",
//           alignItems: "center",
//         }}>
//           {formData.user.profile_photo && (
//             <FontAwesomeIcon icon={faCheck} color="green" size={20} />
//           )}
//         </View>
//       </View>

//       <TouchableOpacity
//         onPress={() => setShowAreaModal(true)}
//         style={authStyles.input}
//       >
//         <Text style={{ color: "#767676" }}>
//           {formData.target_audience
//             ? formData.target_audience
//             : "Select your target audience"}
//         </Text>
//       </TouchableOpacity>

//       <Modal visible={showAreaModal} transparent={true} animationType="slide">
//         <View style={authStyles.modalOverlay}>
//           <View style={authStyles.modalContainer}>
//             <Text style={authStyles.h2}>Select your target area</Text>
//             <Picker
//               selectedValue={formData.target_audience}
//               style={authStyles.picker}
//               onValueChange={(value) => {
//                 handleChange("target_audience", value);
//               }}
//             >
//               {AREA_OPTIONS.map((option) => (
//                 <Picker.Item
//                   key={option.value}
//                   label={option.label}
//                   value={option.value}
//                 />
//               ))}
//             </Picker>
//             <CustomButton
//               title="Close"
//               onPress={() => setShowAreaModal(false)}
//             />
//           </View>
//         </View>
//       </Modal>

//       <CustomButton title="Register" onPress={handleSubmit} />
//     </View>
//   );
// };

export default RegisterBusiness;
