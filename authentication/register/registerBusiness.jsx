import React, { useState } from "react";

import AdditionalInfo from "./registerMoreInfo";
import BasicInfo from "./registerBasicInfo";

const RegisterBusiness = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [emailVerified, setEmailVerified] = useState(false);
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
          nextStep={nextStep}
          formData={formData}
          handleChange={handleChange}
          emailVerified={emailVerified}
          setEmailVerified={setEmailVerified}
          type="business"
        />
      );
    case 2:
      return (
        <AdditionalInfo
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          prevStep={prevStep}
          type="business"
        />
      );
    default:
      return null;
  }
};

export default RegisterBusiness;
