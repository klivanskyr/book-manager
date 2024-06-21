'use client';

import { ReactElement, useContext, useEffect } from 'react';
import { UserContext } from '@/app/types/UserContext';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import Search from './InputArea';
import Shelf from './Shelf';
import { FormSubmitButton } from '@/app/components';
import { auth } from '@/firebase/firebase';

function Dashboard({ params }: { params: { id: string } }): ReactElement {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    function handleSignOut() {
        signOut(auth)
        .then(() => {
            setUser(null);
            router.push('/login');
        })
        .catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        if (!user) {
            // console.log("user is null, pushing to login")
            router.push('/login');
        }
    }, [user]);

    return (
        <div>
            <FormSubmitButton className='' onClick={handleSignOut} text='Sign Out' />
            <div className='flex flex-col items-center h-auto'>
                {user ? <Search /> : null}
                {user ? <Shelf /> : null}
            </div>
        </div>
    )
}

export default Dashboard;