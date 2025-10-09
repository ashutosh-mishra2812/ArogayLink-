import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Patient Login - ArogyaLink+",
  description:
    "Sign in to your ArogyaLink+ account to access healthcare consultations.",
};

export default function PatientLoginPage() {
  return <AuthForm type="login" userRole="patient" />;
}
