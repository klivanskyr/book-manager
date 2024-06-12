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

    // //fetches books on load
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (user === null) { 
    //             router.push('/login');
    //             return;
    //         }
    //         const res = await loadBooks(user.user_id);  
    //         console.log('\n\nresults:', res);

    //         const userUpdatedBooks: User = {
    //             user_id: user.user_id,
    //             books: res
    //         };

    //         setUser(userUpdatedBooks);
    //     };

    //     fetchData();
    // }, []);

    function handleSignOut() {
        console.log('signing out');
        setUser(null);
        router.push('/login');
    }

    console.log('user:', user);

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