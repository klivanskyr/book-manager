'use client';

import { ReactElement, useContext, useEffect, useState } from 'react';
import { UserContext } from '@/app/types/UserContext';
import { useRouter } from 'next/navigation';

import Shelf from './Shelf';
import BookSelect from './BookSelect';
import { signOut } from 'firebase/auth';
import { Navbar, ActionButton } from "@/app/components";
import { auth } from '@/firebase/firebase';


function Dashboard({ params }: { params: { id: string } }): ReactElement {
    const { user, setUser } = useContext(UserContext);
    const [modalActive, setModalActive] = useState(false);
    const router = useRouter();


    // useEffect(() => {
    //     if (!user) {
    //         // console.log("user is null, pushing to login")
    //         router.push('/login');
    //     }
    // }, [user]);

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

    function handleModalClose() {
        setModalActive(false);
    }


    const leftElements = [
        <h1 className="ml-4 font-Urbanist font-medium text-lg">Book Manager</h1>,
    ];

    const rightElements = [
        <ActionButton className='rounded-full h-12' onClick={() => setModalActive(true)} text="Add Book" />,
        <ActionButton className="m-1 bg-red-500 rounded-full h-12" onClick={handleSignOut} text="Sign Out" />
    ];

    return (
        <div className='flex flex-col items-center h-auto'>
            <BookSelect active={modalActive} setActive={setModalActive} />
            <Navbar className='w-full flex justify-between h-16 bg-slate-50 shadow-medium' leftElements={leftElements} rightElements={rightElements} />
            <Shelf />
        </div>
    )
}

export default Dashboard;