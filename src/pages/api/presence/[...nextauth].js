// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import { Providers } from 'next-auth';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: {  label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // Logique pour vérifier l'utilisateur
        const user = { id: 1, name: 'User', email: 'user@example.com' };
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // Page de connexion
  }
});
