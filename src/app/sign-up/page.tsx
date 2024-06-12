'use client';

import { ReactElement, useContext } from 'react';
import { useRouter } from 'next/navigation';

import Form from './Form'
import { createUser, UserContext } from '@/app/types/UserContext';

async function Signup() {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();


    async function handleSubmit({ email, username, password, _ }: { email: string, username: string, password: string, _: string}) {
        const res = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await res.json();
        if (data.code !== 200) {
            console.log(data.message);
            return;
        }
        
        router.push('/login');
    }

    return (
        <div>
            <Form handleSubmit={await handleSubmit}/>
        </div>
    )
}

export default Signup;