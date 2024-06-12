'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext, User, getUserId, loadBooks } from '@/app/types/UserContext'; 
import Form from './Form';

function Login() {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    async function handleSubmit({ email, password }: { email: string, password: string }): Promise<void> {

      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      const data = await res.json();
      if (data.code !== 200) {
        return;
      }

      const books = await loadBooks(data.user_id);
      
      const user: User = {
          user_id: data.user_id,
          books: books
      }

      setUser(user);
      router.push('/dashboard');
    }

  return (
    <div>
      <Form handleSubmit={handleSubmit} /> 
    </div>   
  );
}

export default Login;