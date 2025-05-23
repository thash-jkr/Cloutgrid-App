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
      return <OtpVerification nextStep={nextStep} formData={formData} prevStep={prevStep} />;
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

export default RegisterBusiness;
