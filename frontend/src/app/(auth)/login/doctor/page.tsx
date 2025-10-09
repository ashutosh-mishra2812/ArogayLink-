import Authform from "@/components/auth/Authform";

export const metadata={
  title: 'Doctor Login - ArogyaLink+',
  description:'Healthcare provider sign in to ArogyaLink+ platfrom.Manage your pratice and consultations.',
};

export default function DoctorLoginPage{
  return <Authform type='login' userRole='doctor' />
}