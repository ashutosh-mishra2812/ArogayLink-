'use client'
import { Badge, Bell, Calendar, Stethoscope, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface HeaderProps {
  showDashboardNav?: boolean
}

interface NavigationItem {
  lable: string;
  icon: React.ComponentType<any>;
  href: string;
  active: boolean;
}

const Header: React.FC<HeaderProps> = ({ showDashboardNav = false }) => {
  const user = {
    type: 'patient',
    name: 'Yash Mishra',
    profileImage: '/placeholder.png',
    email: "yashmishra33378@gmail.com"
  }

  const isAuthenticated = false
  const pathname = usePathname();

  const getDashboardNavigation = (): NavigationItem[] => {
    if (user?.type === 'patient') {
      return [
        {
          lable: 'Appointment',
          icon: Calendar,
          href: '/patient/dashboard',
          active: pathname?.includes('/patient/dashboard') || false
        },
      ];
    } else if (user?.type === 'doctor') {
      return [
        {
          lable: 'Dashboard',
          icon: Calendar,
          href: '/doctor/dashboard',
          active: pathname?.includes('/doctor/dashboard') || false
        },
        {
          lable: 'Appointment',
          icon: Calendar,
          href: '/doctor/appointment',
          active: pathname?.includes('/doctor/appointment') || false
        },
      ];
    }
    return []
  };

  return (
    <header className='border-b bg-white/97 backdrop-blur-sm fixed top-0 left-0 right-0 z-50'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>

        {/* Left side -> logo + navigation */}
        <div className='flex items-center space-x-9'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md ring-1 ring-blue-400/30 hover:scale-105 transition-transform duration-200'>
              <Stethoscope className='w-7 h-7 text-white drop-shadow-sm' />
            </div>
            <div className='text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent'>
              ArogyaLink+
            </div>
          </Link>

          {isAuthenticated && showDashboardNav && (
            <nav className='hidden md:flex items-center space-x-6'>
              {getDashboardNavigation().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 transition-color ${item.active ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className='text-sm font-semibold'>{item.lable}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {isAuthenticated && showDashboardNav ? (
          <div className='flex items-center space-x-8'>
            <Button variant='ghost' size='lg' className="relative m-19 hover:bg-gray-100 transition">
              <Bell className='w-6 h-6 text-gray-700' />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-semibold border-none">
                4
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='flex items-center space-x-2'>
                  <Avatar className='w-9 h-9'>
                    <AvatarImage src={user?.profileImage} alt={user.name}></AvatarImage>
                    <AvatarFallback className='bg-blue-150 text-blue-600 text-sm font-semibold'>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='hidden md:block text-left'>
                    <p className='text-sm font-semibold text-gray-900'>
                      {user.name}
                    </p>
                    <p className='text-xs text-gray-500 capitalize'>
                      {user.type}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex items-center space-x-2'>
                    <Avatar className='w-12 h-12'>
                      <AvatarImage src={user?.profileImage} alt={user.name}></AvatarImage>
                      <AvatarFallback className='bg-blue-150 text-blue-600'>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold truncate'>
                        {user.name}
                      </p>
                      <p className='text-sm text-gray-500 truncate max-w-[140px]'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${user.type}/profile`} className='flex items-center'>
                    <User className='w-4 h-4 mr-2' />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${user.type}/setting`} className='flex items-center'>
                    <User className='w-4 h-4 mr-2' />
                    Setting
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className='flex items-center space-x-3'>
            {!isAuthenticated ? (
              <>
                <Link href='/login/patient'>
                  <Button
                    variant='ghost'
                    className='text-blue-900 font-semibold hover:text-blue-700'
                  >
                    Log in
                  </Button>
                </Link>

                <Link href='/signup/patient'>
                   <Button className='bg-gradient-to-r from-blue-600 to-blue-700 font-semibold hover:from-blue-700 hover:to-blue-800 rounded-xl px-2'>
                        Book Consultation
                        </Button>
                </Link>
                </>
                
            ) : (
              <div className='flex items-center space-x-4'>
                <span className='hidden md:block text-sm text-gray-700 font-medium whitespace-nowrap'>
                  Welcome,&nbsp;{user?.name}
                </span>
                <Link href={`/${user?.type}/dashboard`}>
                  <Button
                    variant='ghost'
                    className='bg-gradient-to-r from-blue-600 to-blue-700 font-semibold hover:from-blue-700 hover:to-blue-800 rounded-lg'
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  )
}

export default Header
