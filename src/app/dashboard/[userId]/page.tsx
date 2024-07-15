'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import { BookSelect } from '@/components';
import { NavBarLR, ActionButton, ShelfTables, AddShelfModal } from "@/components";
import { auth, getAllBooks, getUserShelves } from '@/firebase/firestore';
import { Shelf } from '@/types/Shelf';
import { Button } from '@nextui-org/react';

type Tab = 'owned' | 'followed';

export default function Dashboard({ params }: { params: { userId: string } }): ReactElement {
    const [ownedShelves, setOwnedShelves] = useState<Shelf[]>([]);
    const [followedShelves, setFollowedShelves] = useState<Shelf[]>([]);
    const [bookSelectActive, setBookSelectActive] = useState(false);
    const [addShelfActive, setAddShelfActive] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('owned');
    const router = useRouter();

    const fetchShelves = async (userId: string) => {
        const ownedShelves = await getUserShelves(userId, 'owned');
        if (!ownedShelves) {
            console.error('No shelves found');
            return;
        }
        const allBooksShelf: Shelf = await getAllBooks(userId);
        ownedShelves.push(allBooksShelf);
        setOwnedShelves(ownedShelves);

        const followedShelves = await getUserShelves(userId, 'followed');
        if (!followedShelves) {
            console.error('No shelves found');
            return;
        }
        console.log(followedShelves);
        setFollowedShelves(followedShelves);
    }

    useEffect(() => {
        fetchShelves(params.userId);
    }, []);

    const handleSignOut = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/logout`, {
            method: 'DELETE',
            cache: 'no-cache',
        });
        signOut(auth)
        .then(() => {
            router.push('/explore');
        })
        .catch((error) => {
            console.error(error);
        });
    }


    const leftElements = [
        <h1 className="mx-4 font-medium text-lg text-center text-white">Book Manager</h1>,
    ];

    const rightElements = [
        <ActionButton className='rounded-full h-12 bg-slate-600 hover:bg-slate-500 transition-all shadow-medium text-white font-light w-[300px]' onClick={() => router.push('/explore')} text="Explore" />,
        <ActionButton className='m-1 rounded-full h-12 bg-slate-600 hover:bg-slate-500 transition-all shadow-medium text-white font-light' onClick={() => setAddShelfActive(true)} text="Add Shelf" />,
        <ActionButton className='rounded-full h-12 bg-slate-600 hover:bg-slate-500 transition-all shadow-medium text-white font-light' onClick={() => setBookSelectActive(true)} text="Add Book" />,
        <ActionButton className="m-1 border-1.5 border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full h-12" onClick={handleSignOut} text="Sign Out" />
    ];

    return (
        <div className='flex flex-col h-screen'>
            <BookSelect userId={params.userId} shelves={ownedShelves} fetchShelves={fetchShelves} active={bookSelectActive} setActive={setBookSelectActive} />
            <AddShelfModal fetchLatestShelves={fetchShelves} userId={params.userId} active={addShelfActive} setActive={setAddShelfActive} />
            <NavBarLR className='w-full flex justify-between h-16 bg-slate-700 shadow-md' leftElements={leftElements} rightElements={rightElements} />
            <div className='flex flex-row'>
                <Button className={`${activeTab === 'owned' ? 'bg-white border-r-1.5 border-t-1.5 border-l-1.5' : 'bg-gray-300'} rounded-b-none ml-1 mt-1`} onClick={() => setActiveTab('owned')}>View Owned</Button>
                <div className='border-b-1 w-[2px]'></div>
                <Button className={`${activeTab === 'followed' ? 'bg-white border-r-1 border-t-1 border-l-1' : 'bg-gray-300'} rounded-b-none mt-1`} onClick={() => setActiveTab('followed')}>View Followed</Button>
                <div className='w-full border-b-1'></div>
            </div>
            <ShelfTables shelves={activeTab === 'owned' ? ownedShelves : followedShelves} userId={params.userId} />
        </div>
    )
}