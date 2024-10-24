import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError('Erreur d\'inscription');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen ">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
        >
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-center text-purple-800">Bienvenue !</h1>
          <p className="text-center text-gray-600 mb-4 lg:mb-6">Créez votre compte pour commencer</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Votre nom
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Votre poste
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Sélectionner votre poste</option>
                <option value="Developer">Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Graphic Designer">Graphic Designer</option>
                <option value="Illustrator">Illustrator</option>
                <option value="HR">HR</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Créer un compte
            </motion.button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Déjà un compte{' '}
            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
      <div className="hidden lg:block w-full lg:w-1/2">
        <div className="h-full flex items-center justify-center">
          <Image
            src="/design.avif"
            alt="Worked man"
            width={500}
            height={500}
            className="object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
