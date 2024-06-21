'use client';

import { ReactElement, useContext, useEffect } from 'react';
import { UserContext } from '@/app/types/UserContext';
import { useRouter } from 'next/navigation';

import Search from './InputArea';
import Shelf from './Shelf';

function Dashboard({ params }: { params: { id: string } }): ReactElement {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // console.log("user is null, pushing to login")
            router.push('/login');
        }
    }, [user]);

    return (
        <div className='flex flex-col items-center h-auto'>
            {user ? <Search /> : null}
            {user ? <Shelf /> : null}
        </div>
    )
}

export default Dashboard;