'use client';

import { ReactElement, useContext, useEffect } from 'react';
import { User, UserContext, loadBooks } from '@/app/types/UserContext';
import { useRouter } from 'next/navigation';

import Search from './InputArea';
import Shelf from './Shelf';
import SignoutButton from '../components/SignoutButton';

function Dashboard(): ReactElement {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    function handleSignOut() {
        setUser(null);
        router.push('/login');
    }

    if (!user) {
        router.push('/login');
    }

    return (
        <div>
            <SignoutButton handleClick={handleSignOut} />
            <div className='flex flex-col items-center h-auto'>
                {user ? <Search /> : null}
                {user ? <Shelf /> : null}
            </div>
        </div>
    )
}

export default Dashboard;