import React, { useState } from "react";

import BasicInfo from "./registerBasicInfo";
import OtpVerification from "./registerOTP";
import AdditionalInfo from "./registerMoreInfo";

const RegisterCreator = () => {
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
    area: "",
  });

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleChange = (name, value) => {
    if (name === "area") {
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
          nextStep={nextStep}
          formData={formData}
          handleChange={handleChange}
          type="creator"
        />
      );
    case 2:
      return (
        <OtpVerification
          nextStep={nextStep}
          formData={formData}
          prevStep={prevStep}
        />
      );
    case 3:
      return (
        <AdditionalInfo
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          type="creator"
        />
      );
    default:
      return null;
  }
};

export default RegisterCreator;
