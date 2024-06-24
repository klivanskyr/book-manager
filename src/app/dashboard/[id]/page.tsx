'use client';

import { ReactElement, useContext, useEffect, useState } from 'react';
import { User, UserContext } from '@/app/types/UserContext';
import { useRouter } from 'next/navigation';

import Shelf from './Shelf/Shelf';
import BookSelect from './BookSelect';
import { signOut } from 'firebase/auth';
import { Navbar, ActionButton } from "@/app/components";
import { auth, database } from '@/firebase/firebase';
import { onValue, ref } from 'firebase/database';
import { loadBooks } from '@/app/db';


export default function Dashboard({ params }: { params: { id: string } }): ReactElement {
    const { user, setUser } = useContext(UserContext);
    const [modalActive, setModalActive] = useState(false);
    const router = useRouter();

    /*
        When redirected from login to dashboard, 
        the user is null because they did not 'login' this session.
        So we need to fetch their information
    */
    useEffect(() => {
        const getUser = async () => {
            if (!user) {
                const userBooksRef = ref(database, `usersBooks/${params.id}`);
                onValue(userBooksRef, async (userBooksSnapshot) => { //listens for realtime updata
                    const books = await loadBooks(userBooksSnapshot);
                const updatedUser: User = {
                    user_id: params.id,
                    books
                };
                console.log('updated user', updatedUser);
                setUser(updatedUser);
                });
            }
        }

        getUser();
    }, []);

    function handleSignOut() {
        const res = fetch('http://localhost:3000/api/auth/logout', {
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
        <h1 className="ml-4 font-Urbanist font-medium text-lg">Book Manager</h1>,
    ];

    const rightElements = [
        <ActionButton className='rounded-full h-12' onClick={() => setModalActive(true)} text="Add Book" />,
        <ActionButton className="m-1 bg-red-500 rounded-full h-12" onClick={handleSignOut} text="Sign Out" />
    ];

    return (
        <div className='flex flex-col h-auto'>
            <BookSelect active={modalActive} setActive={setModalActive} />
            <Navbar className='w-full flex justify-between h-16 bg-slate-50 shadow-md' leftElements={leftElements} rightElements={rightElements} />
            <Shelf />
        </div>
    )
}