import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers, } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'ArogyaLink+ - Online Doctor Consultations',
  description: 'Connect with certified doctors online for quality healthcare. Get professional medical advice and consultations from the comfort of your home with ArogyaLink.',
  keywords: ['telemedicine', 'online doctor', 'healthcare', 'consultation', 'medical advice', 'teleconsultation', 'ArogyaLink'],
  authors: [{ name: 'ArogyaLink ' }],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
