"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Phone, User, Heart, ArrowLeft, ArrowRight, Check } from "lucide-react"; // ✅ Added missing icons
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface MedicalHistory {
  allergies: string;
  medications: string;
  pastIllnesses: string;
  surgeries: string;
  familyHistory: string;
}

interface PatientOnboardingData {
  phone: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  emergencyContact: EmergencyContact;
  age?: number;
  address?: string;
  medicalHistory: MedicalHistory;
}

const PatientOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<PatientOnboardingData>({
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    medicalHistory: {
      allergies: "",
      medications: "",
      pastIllnesses: "",
      surgeries: "",
      familyHistory: "",
    },
  });

  const { updateProfile, user, loading } = useAuthStore();
  const router = useRouter();

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmergencyContactChange = (
    field: keyof EmergencyContact,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const handleMedicalHistoryChange = (
    field: keyof MedicalHistory,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await updateProfile({
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        emergencyContactName: formData.emergencyContact.name,
        medicalHistory: formData.medicalHistory,
      });
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleNext = (): void => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/40 transform hover:scale-105 transition-transform duration-300">
          <Heart className="w-12 h-12 text-white animate-pulse" />
        </div>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome, {user?.name || "User"}! 👋
        </h1>
        <p className="text-xl text-gray-600 font-medium">
          Complete your health profile in 3 easy steps ✨
        </p>
      </div>

      {/* Progress Step */}
      <div className="flex justify-between mb-12 w-full max-w-3xl relative">
        <div className="absolute top-6 left-0 right-0 h-2 bg-gray-200 rounded-full shadow-inner" />
        <div
          className="absolute top-6 left-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg"
          style={{
            width: `${((currentStep - 1) / 2) * 100}%`,
          }}
        />

        <div className="flex justify-between w-full relative">
          {[
            { num: 1, icon: User, label: "Personal Info", color: "from-blue-500 to-blue-600" },
            { num: 2, icon: Phone, label: "Emergency", color: "from-indigo-500 to-indigo-600" },
            { num: 3, icon: Heart, label: "Medical", color: "from-purple-500 to-purple-600" },
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 transform ${
                  currentStep >= step.num
                    ? `bg-gradient-to-br ${step.color} text-white shadow-2xl scale-110 rotate-3`
                    : "bg-white border-2 border-gray-300 text-gray-400 shadow-lg hover:scale-105"
                }`}
              >
                {currentStep > step.num ? (
                  <Check className="w-7 h-7 animate-bounce" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              <span
                className={`mt-3 text-sm font-semibold transition-all duration-300 ${
                  currentStep >= step.num
                    ? "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <Card className="shadow-2xl border-2 border-white backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-shadow duration-300 w-full max-w-3xl">
        <CardContent className="p-8 md:p-12">
          {/* Step Sections */}
          {currentStep === 1 && (
            <>
              <div className="flex items-center space-x-4 pb-6 border-b-2 border-gradient-to-r from-blue-200 to-purple-200">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Personal Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    placeholder="+91 6392635665"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="blood-group">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="flex items-center space-x-4 pb-6 border-b-2 border-gradient-to-r from-indigo-200 to-purple-200">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Emergency Contact
                </h2>
              </div>

              <Alert className="my-4">
                <AlertDescription>
                  This information will be used to contact someone on your behalf in case of an emergency.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 mt-6">
                <Label htmlFor="emergencyName">Contact Name *</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                  placeholder="Full Name"
                  required
                />

                <Label htmlFor="emergencyPhone">Phone *</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                  placeholder="+91 6392635665"
                  required
                />

                <Label htmlFor="relationship">Relationship *</Label>
                <Select
                  value={formData.emergencyContact.relationship}
                  onValueChange={(value) => handleEmergencyContactChange("relationship", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="relative">Relative</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="flex items-center space-x-4 pb-6 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Medical Information
                </h2>
              </div>

              <Alert className="my-4">
                <AlertDescription>
                  This information helps us provide better healthcare.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 mt-6">
                <Label>Known Allergies</Label>
                <Textarea
                  value={formData.medicalHistory.allergies}
                  onChange={(e) => handleMedicalHistoryChange("allergies", e.target.value)}
                  placeholder="e.g., Penicillin, Pollen, Peanuts (or 'None')"
                />

                <Label>Current Medications</Label>
                <Textarea
                  value={formData.medicalHistory.medications}
                  onChange={(e) => handleMedicalHistoryChange("medications", e.target.value)}
                  placeholder="List medications or 'None'"
                />

                <Label>Past Illnesses</Label>
                <Textarea
                  value={formData.medicalHistory.pastIllnesses}
                  onChange={(e) => handleMedicalHistoryChange("pastIllnesses", e.target.value)}
                  placeholder="List illnesses or 'None'"
                />
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-10 mt-10 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 &&
                    (!formData.phone || !formData.dob || !formData.gender)) ||
                  (currentStep === 2 &&
                    (!formData.emergencyContact.name ||
                      !formData.emergencyContact.relationship ||
                      !formData.emergencyContact.phone))
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-gray-500 mt-8">
        Your information is secure and protected 🔒
      </p>
    </div>
  );
};

export default PatientOnboardingForm;
