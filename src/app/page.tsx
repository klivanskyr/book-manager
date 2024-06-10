'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { UserContext, User } from '@/app/types/UserContext'; 
import Form from './components/Form';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  if (user !== null) {
    router.push('/dashboard');
  }

  function handleSubmit({ email, password }: { email: string, password: string }): void {
    console.log('email:', email);
    console.log('password:', password);
  }

  return (
    <div>
      <Form handleSubmit={handleSubmit} /> 
    </div>   
  );
}