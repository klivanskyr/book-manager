'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext, User, getUserId, loadBooks } from '@/app/types/UserContext'; 
import Form from './Form';

function Login() {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    async function handleSubmit({ email, password }: { email: string, password: string }): Promise<void> {

      console.log('email: ', email, 'password: ', password);
      
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
        console.log(data.message);
        return;
      }

      console.log('login result: ', res, 'login data: ', data);

      // const user: User = {
      //     user_id: id,
      //     books: res
      // }

      // setUser(user);
      // router.push('/dashboard');
    }

  return (
    <div>
      <Form handleSubmit={handleSubmit} /> 
    </div>   
  );
}

export default Login;