import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// This is a simple example. In a real app, you'd want to store these securely
const validUsers = [
  { id: 1, email: 'user@example.com', password: 'your-secure-password' },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = validUsers.find(user => 
          user.email === credentials.email && 
          user.password === credentials.password
        );
        
        if (user) {
          return { id: user.id, email: user.email };
        }
        return null;
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key', // In production, use a proper secret
});
