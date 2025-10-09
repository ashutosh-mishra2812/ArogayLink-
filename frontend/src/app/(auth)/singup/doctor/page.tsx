import Authform from "@/components/auth/Authform";

export const metadata = {
  title: 'Join ArogyaLink+ | Offer Online Consultations as a Healthcare Provider',
  description: 'Sign up on ArogyaLink+ as a healthcare professional and connect instantly with patients for seamless online consultations.',
};

export default function DoctorSingupPage{
  return <Authform type='signup' userRole='doctor' />
}