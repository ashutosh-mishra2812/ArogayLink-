import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Doctor Login - ArogyaLink+",
  description:
    "Healthcare providers can sign in to the ArogyaLink+ platform to manage their practice and consultations.",
};

export default function DoctorLoginPage() {
  return <AuthForm type="login" userRole='doctor' />;
}
