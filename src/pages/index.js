import Image from "next/image";
import localFont from "next/font/local";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const LoadingSpinner = () => (
  <motion.div
    className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
      <LoadingSpinner />
      <motion.h2 
        className="mt-4 text-xl font-semibold text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Chargement de votre espace...
      </motion.h2>
    </div>
  );
}
