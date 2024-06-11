'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext, User, getUserId, loadBooks } from '@/app/types/UserContext'; 
import Form from './Form';

function Login() {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    async function handleSubmit({ email, password }: { email: string, password: string }): Promise<void> {
        //I DONT CHECK PASSWORDS YET
        console.log('email:', email, 'password:', password);
        const id = await getUserId(email);
        if (!id) {
            console.log('error, could not find id from email');
            return; //TODO: handle error
        }

        const res = await loadBooks(id);
        console.log('\n\nresults:', res);

        const user: User = {
            user_id: id,
            books: res
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