'use client';

import { ReactElement, useContext, useEffect, useState } from 'react';
import { User, UserContext } from '@/app/types/UserContext';
import { useRouter } from 'next/navigation';

import Shelf from './Shelf/Shelf';
import BookSelect from './BookSelect';
import { signOut } from 'firebase/auth';
import { Navbar, ActionButton } from "@/app/components";
import { auth, database } from '@/firebase/firebase';
import { ref } from 'firebase/database';
import FilterBar from '../FilterBar/FiliterBar';


export default function Dashboard({ params }: { params: { id: string } }): ReactElement {
    const { user, setUser } = useContext(UserContext);
    const [modalActive, setModalActive] = useState(false);
    const [shownBooks, setShownBooks] = useState([]);
    const router = useRouter();

    /*
        When redirected from login to dashboard, 
        the user is null because they did not 'login' this session.
        So we need to fetch their information
    */
    useEffect(() => {
        const getUser = async () => {
            if (!user || !user.user_id) {
                const userBooksRef = ref(database, `usersBooks/${params.id}`);
                const updatedUser: User = {
                    user_id: params.id,
                    books: user ? user.books : null
                };
                setUser(updatedUser);
            }
        }

        getUser();
    }, []);

    const handleSignOut = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/logout`, {
            method: 'DELETE',
            cache: 'no-cache',
        });
        signOut(auth)
        .then(() => {
            setUser(null);
            router.push('/login');
        })
        .catch((error) => {
            console.error(error);
        });
    }


    const leftElements = [
        <h1 className="mx-4 font-medium text-lg text-center">Book Manager</h1>,
    ];

    const rightElements = [
        <ActionButton className='rounded-full h-12' onClick={() => setModalActive(true)} text="Add Book" />,
        <ActionButton className="m-1 bg-red-500 rounded-full h-12" onClick={handleSignOut} text="Sign Out" />
    ];

    return (
        <div className='flex flex-col h-screen'>
            <BookSelect active={modalActive} setActive={setModalActive} />
            <Navbar className='w-full flex justify-between h-16 bg-slate-50 shadow-md' leftElements={leftElements} rightElements={rightElements} />
            <FilterBar setShownBooks={setShownBooks} />
            <Shelf shownBooks={shownBooks} />
        </div>
    )
}