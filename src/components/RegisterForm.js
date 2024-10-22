import { useState } from 'react';
import { useRouter } from 'next/router';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Erreur d\'inscription');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900">Inscription</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

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

        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="Developer">Développeur</option>
            <option value="UI/UX Designer">Designer UI/UX</option>
            <option value="Graphic Designer">Designer Graphique</option>
            <option value="Illustrator">Illustrateur</option>
            <option value="HR">RH</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition duration-300"
        >
    S\inscrire
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
