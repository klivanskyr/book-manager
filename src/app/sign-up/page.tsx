'use client';

import { ReactElement, useContext } from 'react';
import { useRouter } from 'next/navigation';

import Form from './Form'
import { createUser, UserContext } from '@/app/types/UserContext';

async function Signup() {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();


    async function handleSubmit({ email, username, password, _ }: { email: string, username: string, password: string, _: string}) {
        const new_id = await createUser(username, password, email);
        if (!new_id) {
            console.log('error, could not create user');
            return; //TODO: handle error
        }

        const user = {
            user_id: new_id,
            books: []
        }

        setUser(user);
        console.log('created user:', user);
        router.push('/login');
    }

    return (
        <div>
            <Form handleSubmit={await handleSubmit}/>
        </div>
    )
}

export default Signup;