import Image from "next/image";
import localFont from "next/font/local";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier si le token est valide
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

 // Ecran de chargement pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-2xl">Chargement...</div>
    </div>
  );
}
