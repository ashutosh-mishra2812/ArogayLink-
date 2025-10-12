"use client"
import { useAuthStore } from '@/store/authStore';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('login/patient');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // or a loading spinner, etc.
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className='bg-white border-b px-6 py-4'>
<div className='max-w-4xl mx-auto'>
  <div className='text-2xl font-bold text-gray-800'>ArogyaLink+</div>
</div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6 ">
        {children}
      </main>
    </div>
  )
}

export default layout