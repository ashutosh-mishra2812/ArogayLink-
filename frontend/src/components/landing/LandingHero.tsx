import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { healthcareCategories } from '@/lib/constant'


const LandingHero = () => {



  const handleCategoryClick=(categoryTitle:string)=>{

  }
  return (
  <section className="relative py-24 px-6 bg-gradient-to-b from-blue-100 via-white to-white overflow-hidden">
  <div className="container mx-auto text-center relative z-10">
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
      The place where <br />
      <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        doctors listen to you
      </span>
    </h1>

   <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
  Online primary care that's affordable with or without insurance. <br />
  <span className="text-gray-800 font-medium">
    Quality healthcare, accessible anytime, anywhere.
  </span>
</p>


    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <Button
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full px-8 py-3 text-lg shadow-md transition-transform transform hover:scale-105"
      >
        Book a video visit
      </Button>
      
      <Link href="/login/doctor">
        <Button
          size="lg"
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-3 text-lg transition-colors"
        >
          Login as Doctor
        </Button>
      </Link>
    </div>

    {/* Healthgcare categories */}
    <section className='py-7'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-center items-center overflow-x-auto gap-6 pb-2 scrollbar-hide mx-auto'>
          {healthcareCategories.map((category) =>(
            <button 
            key={category.id}
            onClick={()=> handleCategoryClick(category.title)}
            className='flex flex-col items-center min-w-{100px} group transition-transform'>
              <div
              className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center mb-2 gruop-hover:shadow-xl transition-all duration-200`}>
                <svg className='w-6 h-6 text-white' fill='currentColr' viewBox='0 0 24 24'>
                  <path d={category.icon}/>
                </svg>
              </div>
              <span className='text-xs font-meduim text-blue-900 text-center leadin-tight'>
                {category.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>


    {/* Trust Indicator */}
    <div className='flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600'>
      <div className='flex items-center space-x-2'>
        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
        <span>500+ Certifed Doctors</span>
        
      </div>
            <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
           <span>50,000 Satisfied Patients</span>
        
      </div>
           <div className='flex items-center space-x-2'>
           <div className='w-2 h-2 bg-green-500 rounded-full'></div>
           <span>24/7 Available</span>
        
      </div>
    </div>
  </div>
</section>

  )
}

export default LandingHero