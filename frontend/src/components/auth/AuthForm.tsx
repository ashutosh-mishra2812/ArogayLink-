'use client'
import { useAuthStore } from '@/store/authStore';
// import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { sign } from 'crypto';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Eye, EyeOff, Link } from 'lucide-react';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';

interface AuthformProps {
  type: 'login' | 'signup';
  userRole: 'patient' | 'doctor';
}
const Authform = ({ type, userRole }: AuthformProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { registerPatient, registerDoctor, loginDoctor, loginPatient, loading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'signup' && !agreeTerms) return;
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
        if (userRole === 'doctor') {
          await loginDoctor(formData.email, formData.password);
          router.push('/doctor/dashboard');
        }
        else {
          await loginPatient(formData.email, formData.password);
          router.push('/patient/dashboard');
        }
      }
    } catch (error) {
      console.log(error);
      console.log(`${type},failed:`, error);
    }
  }

  const handleGoogleAuth = ()=>{
    window.location.href =`${process.env.NEXT_PUBLIC_API_URL}/auth/google?type=${userRole}`
  }

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
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>{title}</h2>
          {error && (<div className='mb-5 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm'>{error}</div>)}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {isSignup && (
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='border-0 border-b-2 border-gray-300 focus-visible:ring-0 focus:border-blue-500 rounded-none'
                  required
                />
              </div>
            )}
            <div className='space-y-2'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='border-0 border-b-2 border-gray-300 focus-visible:ring-0 focus:border-blue-500 rounded-none'
                required
              />
            </div>


            <div className='space-y-2'>
              <Label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</Label>
              <div className='relative'>
              
              <Input
                id='password'
                value={formData.name}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className='border-0 border-b-2 border-gray-300 focus-visible:ring-0 focus:border-blue-500 rounded-none'
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
                  <EyeOff className='h-4 w-4 text-gray-500' />
                )}
              </Button>
              </div>
            </div>

             {isSignup && (
              <div className='flex items-center'>
                <Checkbox 
                id='terms'
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                 />
                 <label htmlFor='terms' className='ml-2 text-sm text-gray-600 leading-6'>
                  I confirm that I am at least 18 years old, and I agree to the{' '}
                  <Link href='#' className='text-blue-600 hover:underline'>Terms</Link> and{' '}
                  <Link href='#' className='text-blue-600 hover:underline'>Privacy Policy</Link>.
                 </label>
              </div>
            )}

            <Button
              type='submit'
              className='w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center'
              disabled ={loading || (isSignup && !agreeTerms)}
            >
              {loading ? `${type === 'signup' ? 'Creating...' : 'Signing'} in...` : buttonText}
            </Button>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <Separator />
               <div className='absolute inset-0 justify-center'>
                <span className="px-4 text-sm text-gray-600 bg-white">
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 space-y-3'>
              <Button
              type='button'
              variant='outline'
              className='w-full rounded-full border-gray-500'
              onClick={handleGoogleAuth}
              >
                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                 </svg>
                 {isSignup? "Signup": 'Sign in'} with google
              </Button>
            </div>            
          </div>

          <div>
            <span className='text-gray-600'>{altTextLink}</span>
            <Link href={altLinkPath} className='text-blue-600 hover:underline font-medium'>{altLinkAction}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div >


  )
}

export default Authform