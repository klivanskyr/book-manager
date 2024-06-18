'use client'

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { createNewUser } from '@/app/db/db';

const Form = dynamic(() => import('./Form'), { ssr: false });

async function Signup() {
    const router = useRouter();

    async function handleSubmit({ email, username, password }: { email: string, username: string, password: string }) {
        createNewUser(username, email, password)
        .then(() => {
            console.log(`User ${username} added successfully`);
            router.push('/login');
        })
        .catch((error) => {
            console.error('Error adding review: ', error);
        });
    }

    return (
        <div>
            <Form handleSubmit={handleSubmit}/>
        </div>
    )
}

export default Signup;