// Define proper TypeScript interfaces
export interface TimeRange {
  start: string;
  end: string;
}

export interface AvailabilityRange {
  startDate: string;
  endDate: string;
  excludedWeekdays: number[]; // 0 = Sunday, 6 = Saturday
  holidays?: string[]; // ✅ New: Specific holiday dates to exclude
}

export interface HospitalInfo {
  name: string;
  address: string;
  city: string;
  state?: string;   // ✅ New: More granular location
  country?: string; // ✅ New: International support
  pincode?: string;
  contactNumber?: string;
  website?: string;
}

export interface DoctorFormData {
  specialization: string;
  categories: string[];
  qualification: string;
  experience: string;
  about: string;
  fees: string;
  hospitalInfo: HospitalInfo;
  availabilityRange: AvailabilityRange;
  dailyTimeRanges: TimeRange[];
  slotDurationMinutes?: number;
  consultationModes?: ("online" | "offline" | "homeVisit")[]; // ✅ New: Telehealth support
  languagesSpoken?: string[]; // ✅ New: Patient-doctor language matching
}


// ✅ Enhanced User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  type: "doctor" | "patient"; // ✅ New: Admin role
  phone?: string;
  profileImage?: string;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Patient fields
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  age?: number;
  address?: string;
  medicalHistory?: {
    allergies?: string;
    currentMedications?: string;
    chronicConditions?: string;
    surgeries?: string; // ✅ New
    familyHistory?: string; // ✅ New
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };

  // Doctor fields
  specialization?: string;
  about?: string;
  category?: string[];
  qualification?: string;
  experience?: number;
  fees?: number;
  hospitalInfo?:{
        name?:string;
        address?:string;
        city?:string;
  };

  // ✅ Doctor availability fields
  availabilityRange?:{
        strartDate?:string;
        endData?:string;
        excludedweekdays?:number[];
  };
  dailyTimeRanges?:Array<{
        start:string;
        end:string;
  }>;
  slotDurationMinutes?: number;
  consultationModes?: ("online" )[];
  languagesSpoken?: string[];
}


// interfaces/Doctor.ts
export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  category: string[];
  qualification: string;
  experience: number;
  about: string;
  fees: number;
  hospitalInfo?:{
        name?:string;
        address?:string;
        city?:string;
  };

  availabilityRange?:{
        strartDate?:string;
        endData?:string;
        excludedweekdays?:number[];
  };
  dailyTimeRanges:{
        start:string;
        end:string;
  }[];
  slotDurationMinutes: number;
  profileImage: string;
  consultationModes: ("online")[];
  languagesSpoken: string[];
  rating?: number;   // ✅ New: Average doctor rating
  reviewCount?: number; // ✅ New: Number of patient reviews
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface DoctorFilters {
  search?: string;
  specialization?: string;
  category?: string;
  city?: string;
  state?: string;
  country?: string;
  minFees?: number;
  maxFees?: number;
  minExperience?: number; // ✅ New filter
  maxExperience?: number; // ✅ New filter
  consultationMode?: "online" | "offline" | "homeVisit";
  language?: string;
  sortBy?: 'fees' | 'experience' | 'name' | 'createdAt' | 'rating'; // ✅ rating added
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface MonthlyRevenue {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  payoutCompleted?: number; // ✅ New: track payouts
}

export interface UserManagementUser {
  _id: string;
  name: string;
  email: string;
  type: 'patient' | 'doctor' | 'admin'; // ✅ admin included
  isActive?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string; // ✅ New
}

export interface PaymentRecord {
  _id: string;
  date: string;
  doctorName: string;
  doctorEmail: string;
  patientName: string;
  consultationFees: number;
  platformFees: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed'; // ✅ strong typing
  payoutStatus: 'pending' | 'completed' | 'failed';
  payoutDate?: string;
  createdAt: string;
  updatedAt?: string;
  transactionId?: string; // ✅ New
}

export interface ReportData {
  userGrowth: Array<{
    _id: {
      year: number;
      month: number;
    };
    patients: number;
    doctors?: number; // ✅ New
  }>;
  appointmentStats: Array<{
    _id: string;
    count: number;
  }>;
  revenueTrend: Array<{ // ✅ New report section
    _id: {
      year: number;
      month: number;
    };
    revenue: number;
  }>;
}
