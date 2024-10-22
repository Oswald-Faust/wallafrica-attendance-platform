import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Une erreur est survenue lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-8 bg-white rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900">Connexion</h1>
        
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition duration-300"
        >
          Se connecter
        </button>

        <div className="text-center">
          <Link href="/register" className="text-blue-500 hover:text-blue-600">Créer un compte</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
