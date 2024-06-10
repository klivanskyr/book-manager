'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { UserContext } from '@/app/types/UserContext'; 
import ContextWrapper from '@/app/utils/ContextWrapper';

function Home() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  if (user !== null) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default Home;