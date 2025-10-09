'use client';

import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  userType: 'doctor' | 'patient';
}

const Layout: React.FC<LayoutProps> = ({ children, userType }) => {
  const isAuthenticated = false;

  useEffect(() => {
    if (isAuthenticated) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData?.type) {
        const redirectPath =
          userData.type === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
        redirect(redirectPath);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { 
            theme: 'outline', 
            size: 'large', 
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      if (!response?.credential) {
        console.error('No credential returned from Google.');
        return;
      }

      if (!userType) {
        console.error('User type is undefined.');
        return;
      }

      const res = await fetch(`http://localhost:5000/auth/${userType}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: response.credential }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      console.log('Google login response:', data);

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        const redirectPath =
          data.data.user.type === 'doctor'
            ? '/doctor/dashboard'
            : '/patient/dashboard';
        redirect(redirectPath);
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Failed to login with Google. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_25px_100px_rgba(0,0,0,0.12)] p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-[0_30px_120px_rgba(0,0,0,0.15)] hover:border-white/70">
            {children}

            {/* Google Sign-In Button */}
            <div className="mt-6 pt-6 border-t border-gray-200/60">
              <div className="flex items-center justify-center mb-5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="px-4 text-sm text-gray-600 font-medium tracking-wide">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-gradient-to-r rounded-lg from-transparent via-gray-300 to-transparent"></div>
              </div>
              <div id="googleSignInDiv" className="flex justify-center transition-transform duration-200 hover:scale-[1.02]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800" />
        
        {/* Animated overlay patterns */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.15),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.12),transparent_40%)] animate-pulse"
            style={{ animationDuration: '8s' }}
          />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Floating decorative shapes */}
        <div className="absolute top-16 right-16 w-32 h-32 rounded-2xl border-4 border-white/30 rotate-12 backdrop-blur-sm animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 left-16 w-24 h-24 rounded-full border-4 border-white/30 backdrop-blur-sm animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-xl border-4 border-white/20 -rotate-12 backdrop-blur-sm animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
        
        <div className="relative z-10 flex items-center justify-center w-full h-full p-12">
          <div className="text-center text-white max-w-xl">
            {/* Logo/Icon with enhanced effects */}
            <div className="relative mb-12 inline-block group">
              <div className="absolute inset-0 bg-white/30 rounded-3xl blur-3xl group-hover:blur-[40px] transition-all duration-700" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border-2 border-white/40 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <div className="absolute inset-2 bg-white/15 rounded-2xl" />
                <svg
                  className="w-20 h-20 text-white relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
            
            {/* Enhanced typography */}
            <h2 className="text-6xl font-extrabold mb-2 tracking-tight drop-shadow-lg leading-tight animate-fade-in">
              Welcome to
            </h2>
            <h2 className="text-7xl font-extrabold mb-8 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
              ArogyaLink+
            </h2>
            
            {/* Decorative divider */}
            <div className="flex items-center justify-center mb-10">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/60" />
              <div className="mx-4 w-2.5 h-2.5 rounded-full bg-white/80 shadow-lg" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/60" />
            </div>
            
            {/* Tagline and description */}
            <p className="text-2xl font-semibold mb-5 text-blue-50 drop-shadow-lg tracking-wide">
              Your Health, Our Priority
            </p>
            <p className="text-lg leading-relaxed text-white/95 mb-12 max-w-lg mx-auto drop-shadow-md">
              Connecting patients with certified healthcare providers for quality medical consultations, anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;