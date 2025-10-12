import PatientOnboardingForm from "@/components/patient/PatientOnboardingForm";
import React from "react";


export const metadata = {
  title: 'Profile Complete = Care Secured: Start Booking Today!',
  description: 'A few quick steps to complete your profile, then start booking appointments and managing your health with ease.',
};

export default function PatientOnboardingPage() {
  return <PatientOnboardingForm />;
}
