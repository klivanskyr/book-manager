'use client';

import { ReactElement, useContext, useEffect, useState } from 'react';
import { UserContext } from '@/app/types/UserContext';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import BookSelect from './BookSelect';
import { Navbar, ActionButton } from "@/app/components";
import { auth, getShelves } from '@/firebase/firestore';
import Shelves from './Shelves/Shelves';
import AddShelfModal from './AddShelf';
import { Spinner } from '@nextui-org/react';


export default function Dashboard({ params }: { params: { userId: string } }): ReactElement {
    const { user, setUser } = useContext(UserContext);
    const [bookSelectActive, setBookSelectActive] = useState(false);
    const [addShelfActive, setAddShelfActive] = useState(false);
    const router = useRouter();
    
    /*
        When redirected from login to dashboard, 
        the user is null because they did not 'login' this session.
        So we need to fetch their information
    */
        useEffect(() => {
            (async () => {
                const getUser = async () => {
                    if (!user || !user.userId || !user.shelves) {
                        console.log('fetching user');
                        const shelves = await getShelves(params.userId);
                        console.log('shelves', shelves);
                        if (shelves === null) {
                            router.push('/login');
                            return;
                        }
                        setUser({
                            userId: params.userId,
                            shelves: shelves
                        });
                    }
                }
        
                await getUser();
                console.log('user', user);
            })();
        }, [user]);
        

    useEffect(() => {
        console.log('USER', user);
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
        <ActionButton className='m-1 rounded-full h-12' onClick={() => setAddShelfActive(true)} text="Add Shelf" />,
        <ActionButton className='rounded-full h-12' onClick={() => setBookSelectActive(true)} text="Add Book" />,
        <ActionButton className="m-1 bg-red-500 rounded-full h-12" onClick={handleSignOut} text="Sign Out" />
    ];

    return (
        <div className='flex flex-col h-screen'>
            <BookSelect active={bookSelectActive} setActive={setBookSelectActive} />
            <AddShelfModal active={addShelfActive} setActive={setAddShelfActive} />
            <Navbar className='w-full flex justify-between h-16 bg-slate-50 shadow-md' leftElements={leftElements} rightElements={rightElements} />
            <Shelves />
        </div>
    )
}