'use client';

import { ReactElement, useContext, useEffect } from 'react';
import { User, UserContext, loadBooks } from '@/app/types/UserContext';

import Search from './InputArea';
import Shelf from './Shelf';
import ContextWrapper from '@/app/utils/ContextWrapper';

function Dashboard(): ReactElement {
    const { user, setUser } = useContext(UserContext);

    //fetches books on load
    useEffect(() => {
        const fetchData = async () => {
            if (user === null) { return; }
            const res = await loadBooks(user.user_id);  
            console.log('\n\nresults:', res);

            const userUpdatedBooks: User = {
                user_id: user.user_id,
                books: res
            };

            setUser(userUpdatedBooks);
        };

        fetchData();
    }, []);

    console.log('user:', user);

    return (
        <div className='flex flex-col items-center h-auto'>
            {user ? <Search /> : null}
            {user ? <Shelf /> : null}
        </div>
    )
}

export default Dashboard;