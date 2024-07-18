'use client';

import { useEffect, useState } from 'react';

import { NavBarLMR, SideBar, SideBarSections, ExploreCardSmall, Filter, FilterType, FilterBar, FilterBarExplore, ModalElement } from '@/components';
import { UserProfile, ExploreIcon, Settings, Questionmark, SearchIcon, MenuIcon } from '@/assets';
import { Button, Link, Spinner } from '@nextui-org/react';
import { Book, Shelf } from '@/types';
import { auth, getAllPublicShelves, getUserShelves } from '@/firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'firebase/auth';


export default function Explore() {
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterType>('none');
    const [mobileSearchModal, setMobileSearchModal] = useState<boolean>(false);
    const [mobileNavModal, setMobileNavModal] = useState<boolean>(false);
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const router = useRouter();
    
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    // looks for changes in window width, and if going from mobile to desktop, closes the mobile modals
    useEffect(() => {
        function resize() {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth > 1024) {
                setMobileSearchModal(false);
                setMobileNavModal(false);
            }
        }

        window.addEventListener('resize', resize);

        resize();

        return () => window.removeEventListener('resize', resize);
    }, []);



    const fetchShelves = async () => {
        // Get all public shelves
        const shelves = await getAllPublicShelves();
        if (!shelves) {
            console.error('No shelves found');
            return;
        }
        setShelves(shelves);

        // Check if user is logged in and get their followed shelves
        if (userId) {
            const followedShelves = await getUserShelves(userId, 'followed');
            if (!followedShelves) {
                console.error('No shelves found');
                return;
            }
            // Update shelves with followed status
            const updatedShelves = shelves.map((shelf) => {
                if (followedShelves.some((followedShelf) => followedShelf.shelfId === shelf.shelfId)) {
                    return { ...shelf, following: true };
                }
                return shelf;
            });
            setShelves(updatedShelves);

        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchShelves();
        setIsLoading(false);
    }, []);

    const handleUpdateShelf = (newShelf: Shelf) => {
        // client side update
        const newShelves = shelves.map((shelf) => shelf.shelfId === newShelf.shelfId ? newShelf : shelf);
        setShelves(newShelves);
    }

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
        router.push('/explore');
    }

    const leftNavElements = [
        <h1 className="font-medium text-lg text-center text-white">Book Manager</h1>,
    ];

    const middleNavElements = [
        <></>
    ];

    const rightNavElements = [
        <Button className='w-[38px] h-[38px] bg-slate-600 rounded-full mr-2 lg:hidden'isIconOnly onClick={() => setMobileSearchModal(true)}><SearchIcon className='w-[28px] h-[28px]'/></Button>,
        <Button className='w-[38px] h-[38px] bg-slate-600 rounded-full mr-2 lg:hidden'isIconOnly onClick={() => setMobileNavModal(true)}><MenuIcon className='w-[28px] h-[28px]'/></Button>,
        (!userId ? <Button className='rounded-full text-white bg-slate-600 hidden lg:block' onClick={() => router.push('/login')}>Sign In</Button> : <></>),
        (userId ? <Button className="w-[100px] border-1.5 border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full h-12 hidden lg:block" onClick={handleSignOut}>Sign Out</Button> : <></>),
    ];

    const toImplement = 'text-red-600 text-2xl lg:text-base'
    const sideBarSections: SideBarSections = {
        "You": {
            "startContent": <UserProfile className='h-[30px] w-[40px]'/>,
            "subsections": [
                <Link className='cursor-pointer text-2xl lg:text-base' href={userId ? `/dashboard/${userId}` : `/login?redirectUrl=/dashboard`}>Dashboard</Link>,
                <Link className='cursor-pointer text-2xl lg:text-base' href={userId ? `/explore?userId=${userId}` : `/login?redirectUrl=/explore`}>Recent</Link>,
                <Link className={toImplement}>Liked</Link>,
                <Link className='cursor-pointer text-2xl lg:text-base' onPress={userId ? () => setFilter('followed') : () => router.push(`/login?redirectUrl=/explore`)}>Followed</Link>
            ]
        },
        "Explore": {
            "startContent": <ExploreIcon className='h-[37px] w-[40px]'/>,
            "subsections": [
                <Link className='cursor-pointer text-2xl lg:text-base' onPress={() => setFilter('trending')}>Trending</Link>,
                <Link className={toImplement}>Books</Link>,
                <Link className={toImplement}>Authors</Link>,
                <Link className={toImplement}>Genres</Link>
            ]
        },
        "Settings": {
            "startContent": <Settings className='h-[35px] w-[40px]'/>,
            "subsections": [
                <Link className='cursor-pointer text-2xl lg:text-base' href={userId ? `/profile/${userId}` : `/login?redirectUrl=/explore`}>Profile</Link>,
                <Link className='cursor-pointer text-2xl lg:text-base' href={userId ? `/profile/${userId}/settings` : `/login?redirectUrl=/explore`}>Account</Link>,
                <Link className={toImplement}>Appearance</Link>,
                <Link className={toImplement}>Notifications</Link>
            ],
        },
        "Help": {
            "startContent": <Questionmark className='h-[40px] w-[40px]'/>,
            "subsections": [
            <Link className={toImplement}>FAQ</Link>,
            <Link className={toImplement}>Contact Us</Link>,
            <Link className={toImplement}>Report a Bug</Link>,
            <Link className={toImplement}>Feedback</Link>
            ],
        },
    };

    function MobileSearchModal() {
        return (
            <div>
                <FilterBarExplore setShelves={setShelves} setLoading={setIsLoading} />
            </div>
        )
    }

    function MobileNavModal() {
        return (
            <div>
                {Object.entries(sideBarSections).map(([section, { startContent, subsections }]) => (
                    <div className='flex flex-col w-full pb-4 -mt-5 border-b-1 border-black border-opacity-50' key={section}>
                        <div className='flex flex-row justify-center items-center text-xl mb-6 mt-12'>
                            <div className='mx-1'>{startContent}</div>
                            <div className='mx-1 text-3xl'>{section}</div>
                        </div>
                        <div className='font-xl w-full grid grid-cols-2 place-items-center mb-6'>
                            {subsections.map((subsection, index) => (
                                <div key={index} className='m-2'>{subsection}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>  
            <ModalElement placement='bottom-center' active={mobileNavModal} onOpenChange={setMobileNavModal} size='full' Header={<></>} Body={MobileNavModal()} Footer={<></>} />
            <ModalElement placement='bottom-center' active={mobileSearchModal} onOpenChange={setMobileSearchModal} size='5xl' Header={<></>} Body={MobileSearchModal()} Footer={<></>} />
            <NavBarLMR className='flex flex-row w-full justify-between h-16 p-4 border bg-slate-700' leftElements={leftNavElements} middleElements={middleNavElements} rightElements={rightNavElements} />
            <div className='flex flex-row w-full h-full'>
                <SideBar className='hidden lg:block' sections={sideBarSections} />
                <div className='flex flex-col w-full py-4 px-8 justify-center items-center'>
                    <FilterBarExplore className='hidden lg:flex' setShelves={setShelves} setLoading={setIsLoading} />
                    <Filter shelves={shelves} filter={filter as FilterType} setFilter={setFilter} >
                        {filteredShelves => (
                            <div className='w-full h-full flex flex-col items-center justify-start px-1 py-4 lg:p-4'>
                                {isLoading 
                                    ? <div className='w-full h-full flex flex-row items-center justify-center'><Spinner size='lg' /></div>
                                    : filteredShelves.map((shelf, index) => <ExploreCardSmall shelf={shelf} userId={userId} loggedIn={Boolean(userId)} key={`${shelf.shelfId}${index}`} updateShelf={handleUpdateShelf}/>)}
                            </div>
                        )}
                    </Filter>
                </div>
            </div>
        </>
    )
}