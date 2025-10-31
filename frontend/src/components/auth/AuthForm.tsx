// frontend/src/components/auth/AuthForm.tsx
'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '@radix-ui/react-dropdown-menu';

interface AuthformProps {
  type: 'login' | 'signup';
  userRole: 'patient' | 'doctor';
}

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthForm = ({ type, userRole }: AuthformProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { registerPatient, registerDoctor, loginPatient, loginDoctor, loading, error, } =
    useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'signup' && !agreeToTerms) return;

    try {
      if (type === 'signup') {
        if (userRole === 'doctor') {
          await registerDoctor({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        } else {
          await registerPatient({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        }
        router.push(`/onboarding/${userRole}`);
      } else {
        if (userRole === 'doctor'){
          await loginDoctor(formData.email, formData.password);
        } else {
          await loginPatient(formData.email, formData.password);
        }

        router.push(`/${userRole}/dashboard`);
      }
    } catch {
      // error already handled in store
    }
  };

const handleGoogleAuth = () => {
  window.location.href = `${BASE_URL}/auth/google?type=${userRole}`;
};


  const isSignup = type === 'signup';
  const title = isSignup ? 'Create a secure account' : 'Welcome Back';
  const buttonText = isSignup ? 'Create Account' : 'Sign In';
  const altTextLink = isSignup ? "Already have an account? " : "Don't have an account? ";
  const altLinkAction = isSignup ? 'Sign In' : 'Sign Up';
  const altLinkPath = isSignup ? `/login/${userRole}` : `/signup/${userRole}`;


  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-2xl fount-bold text-gray-800'>ArogyaLink+</h1>
      </div>



      <Card className='border-0 shadow-xl'>
        <CardContent className='p-8'>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>{title}</h2>
           <p className="text-gray-600 mb-6">{isSignup ? 'Join us and start your journey' : 'Sign in to continue'}</p>
          {error && (<div className='mb-5 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm'>{error}</div>)}
          <form onSubmit={handleSubmit} className='space-y-2'>
            {isSignup && (
              <div className='space-y-2'>
                <Label htmlFor='name' className="block text-sm font-semibold text-gray-700">Full Name</Label>
                <div className="relative group w-full">
 

  {/* Input */}
   <User
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-focus-within:text-gray-600 group-focus-within:scale-110"
  />
  <Input
    id="name"
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="Enter your full name "
    className=" w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-300"
    required
  />
</div>

              </div>
            )}
            <div className='space-y-2'>
              <Label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email Address</Label>
              <div className="relative group w-full">
              <Mail
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-focus-within:text-gray-600 group-focus-within:scale-110"
  />
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
    className=" w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-300"
    required
  />
  </div>
            </div>


            <div className='space-y-2'>
              <Label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</Label>
                <div className="relative group w-full">
              <Lock
    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-focus-within:text-gray-600 group-focus-within:scale-110"
  />
              
              <Input
                id='password'
                value={formData.password}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
    className=" w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-300"
    required
  />
              <Button
                type='button'
                variant='ghost'
                size={'sm'}
                className='absolute top-0 h-full right-3 hover:bg-translate'
                onClick={() => setShowPassword(!showPassword)}

              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-500' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-500' />
                )}
              </Button>
              </div>
            </div>

             {isSignup && (
              <div className="flex items-start gap-5 bg-gradient-to-r from-gray-50 via-gray-50 to-blue-50 p-3 rounded-xl border-1 border-gray-600 ">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                 className="mt-0.5 border-2 border-blue-300"
                    />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    I confirm that I am at least 18 years old, and I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 underline font-semibold">
                      Terms
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 underline font-semibold">
                      Privacy Policy
                    </a>
                  </label>
              </div>
            )}

            <Button
              type='submit'
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-purple-300 font-medium rounded-xl text-sm  transition-all duration-300 transform hover:scale-105"
                disabled={loading || (isSignup && !agreeToTerms)}
            >
              {loading ?(
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {`${type === 'signup' ? 'Creating...' : 'Signing'} in...`}
                </span>
              ) : buttonText}
            </Button>
            </form>
          

         <div className="mx-auto w-full py-4 ">
          <hr className="border-gray-300" />
                <div className="relative">
                  <Separator className="bg-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-2 py-1 md:px-4 text-sm font-medium text-gray-800 bg-white">Or continue with</span>
                  </div>
                </div>
              </div>

              <div className="gap-5 space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-2 border-gray-200  hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold shadow-sm hover:shadow"
                  onClick={handleGoogleAuth}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isSignup ? 'Sign up' : 'Sign in'} with Google
                </Button>
              </div>


            <div className="mt-8 text-center">
            <a
                  href={altLinkPath}
                  className="text-gray-600"
                > {altTextLink}
                </a>
                <a
                  href={altLinkPath}
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  {altLinkAction}
                </a>
              </div>
        </CardContent>
      </Card>
    </div >


  )
}

export default AuthForm