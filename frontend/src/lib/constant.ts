import { Twitter, Facebook, Linkedin, Instagram, Mail, MapPin, Phone,} from "lucide-react";

export const healthcareCategories = [
  {
    id: 'primary-care',
    title: 'Primary Care',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    color: 'bg-blue-500'
  },
  {
    id: 'manage-condition',
    title: 'Manage Your Condition',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    color: 'bg-green-500'
  },
  {
    id: 'mental-behavioral-health',
    title: 'Mental & Behavioral Health',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
    color: 'bg-yellow-500'
  },
  {
    id: 'sexual-health',
    title: 'Sexual Health',
    icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    color: 'bg-pink-500'
  },
  {
    id: 'childrens-health',
    title: "Children's Health",
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-8h2v6h-2z',
    color: 'bg-red-500'
  },
  {
    id: 'senior-health',
    title: 'Senior Health',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    color: 'bg-orange-500'
  },
  {
    id: 'womens-health',
    title: "Women's Health",
    icon: 'M17.5 9.5C17.5 6.5 15 4 12 4S6.5 6.5 6.5 9.5c0 2.89 2.39 5.43 5.5 6.44V17c0 .55.45 1 1 1s1-.45 1-1v-1.06c3.11-1.01 5.5-3.55 5.5-6.44zM12 14.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    color: 'bg-purple-500'
  },
  {
    id: 'mens-health',
    title: "Men's Health",
    icon: 'M17.5 9.5C17.5 6.5 15 4 12 4S6.5 6.5 6.5 9.5c0 2.89 2.39 5.43 5.5 6.44V20h3v-4.06c3.11-1.01 5.5-3.55 5.5-6.44z',
    color: 'bg-indigo-500'
  },
  {
    id: 'wellness',
    title: 'Wellness',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    color: 'bg-emerald-500'
  }
];



export const testimonials = 
    [
  {
    rating: 5,
    text: "Doctor connected with me instantly, patiently listened to my health issues, and prescribed the right treatment. He explained the medicines clearly and the whole process felt hassle-free.",
    author: "Rahul S.",
    location: "From Delhi",
    bgColor: "bg-chart-1/10"
  },
  {
    rating: 5,
    text: "The consultation was very comfortable. The doctor was polite, answered all my doubts, and gave useful advice. I felt very confident about the treatment.",
    author: "Priya K.",
    location: "From Mumbai",
    bgColor: "bg-chart-2/10"
  },
  {
    rating: 5,
    text: "My doctor was highly professional and caring. She asked all the right questions and explained everything in simple Hindi and English, which made it easy to understand.",
    author: "Meena R.",
    location: "From Lucknow",
    bgColor: "bg-chart-4/10"
  },
  {
    rating: 5,
    text: "Booking the appointment was super quick. I got a consultation the very next morning and was able to continue my regular medicines without delay. This is very helpful for people like me in smaller towns.",
    author: "Amit V.",
    location: "From Jaipur",
    bgColor: "bg-chart-5/10"
  }
];



export const faqs = [
  {
    question: "How much does a doctor visit with ArogyaLink+ cost?",
    answer: "For online consultations, fees usually start at ₹299 and may vary depending on the specialty. With an ArogyaLink+ membership, visits cost as low as ₹199. Membership is ₹499 for three months and ₹1,499 for a yearly plan."
  },
  {
    question: "Do you accept health insurance?",
    answer: "Yes, ArogyaLink+ accepts most major health insurance providers in India, including ICICI Lombard, Star Health, Niva Bupa, HDFC Ergo, and others. You can also pay using UPI, digital wallets, debit/credit cards, or net banking."
  },
  {
    question: "What conditions can ArogyaLink+ doctors treat?",
    answer: "Our doctors provide consultations for fever, cold, cough, allergies, stomach issues, skin problems, women’s health, mental health support, chronic disease management, and many more everyday health concerns."
  },
  {
    question: "How quickly can I see a doctor?",
    answer: "With ArogyaLink+, you can often book same-day appointments, and in many cases connect with a doctor within 30 minutes. Appointments are flexible and designed to fit your schedule."
  },
  {
    question: "Can I get prescriptions and lab tests?",
    answer: "Yes. After your consultation, doctors can provide e-prescriptions. We also help you book lab tests and share results digitally for your convenience."
  },
  {
    question: "Is ArogyaLink+ available in regional languages?",
    answer: "Yes, we support consultations in Hindi, English, and several regional languages, so you can comfortably speak in the language you prefer."
  }
];

export const trustLogos = [
  "The Times of India", 
  "NDTV", 
  "India Today", 
  "The Economic Times", 
  "Hindustan Times", 
  "Business Standard",
  "Moneycontrol", 
  "YourStory", 
  "The Hindu", 
  "Deccan Herald", 
  "ET Healthworld", 
  "The Indian Express"
];

export const contactInfo = [
  {
    icon: Phone,
    text: "1-888-MEDICARE (1-888-633-4227)",
  },
  {
    icon: Mail,
    text: "support@medicare-plus.com",
  },
  {
    icon: MapPin,
    text: "Available across India",
  },
];

    export const footerSections = [
    {
      title: "Company",
      links: [
        { text: "About Us", href: "/about" },
        { text: "Support Center", href: "/support" },
        { text: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "For Healthcare",
      links: [
        { text: "Join as Doctor", href: "/signup/doctor" },
        { text: "Doctor Resources", href: "/doctor-resources" },
      ]
    },
    {
      title: "For Patients",
      links: [
        { text: "Find Doctors", href: "/doctors" },
        { text: "Book Appointment", href: "/signup/patient" },
      ]
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", href: "/privacy" },
        { text: "Terms of Service", href: "/terms" },
      ]
    }
  ];


export const socials = [
  { name: "twitter", icon: Twitter, url: "https://twitter.com/arogyalink-plus" },
  { name: "facebook", icon: Facebook, url: "https://facebook.com/arogyalink-plus" },
  { name: "linkedin", icon: Linkedin, url: "https://linkedin.com/company/arogyalink-plus" },
  { name: "instagram", icon: Instagram, url: "https://instagram.com/arogyalink-plus" },
];