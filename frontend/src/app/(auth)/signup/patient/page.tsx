import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: 'Create Your Patient Account | ArogyaLink+',
  description: 'Join ArogyaLink+ today and instantly connect with trusted doctors, book hassle-free consultations, and take charge of your health with confidence and ease.',
};


export default function PatientSignupPage() {
  return <AuthForm type='signup' userRole='patient' />
}