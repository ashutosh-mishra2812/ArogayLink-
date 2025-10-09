import Authform from "@/components/auth/Authform";

export const metadata={
  title: 'Patient Login - ArogyaLink+',
  description:'Sign in to ArogyaLink+ account to access healthcare consultations.',
};

export default function PatientLoginPage{
  return <Authform type='login' userRole='patient' />
}