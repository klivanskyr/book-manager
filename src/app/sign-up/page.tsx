'use client'

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

import { createNewUser } from '@/app/db/db';

const Form = dynamic(() => import('./Form'), { ssr: false });

async function Signup() {
    const router = useRouter();

    async function handleSubmit({ email, username, password }: { email: string, username: string, password: string }) {
        createUserWithEmailAndPassword(auth, email, password) // Create user in Firebase Auth
        .then((userCredential) => {
            createNewUser(userCredential.user.uid, username, email, password) //Create user in database
            .then(() => {
                //console.log(`User ${username} added successfully`);
                router.push('/login');
            })
            .catch((error) => {
                console.error('Error creating database user: ', error);
            });
        })
        .catch((error) => {
            //console.log('Error creating auth user: ', error);
        });
    }

    return (
        <div>
            <Form handleSubmit={handleSubmit}/>
        </div>
    )
}

export default Signup;