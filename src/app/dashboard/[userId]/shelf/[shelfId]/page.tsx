'use client';

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

import { UserContext } from "@/app/types/UserContext";
import { Shelf } from "@/app/types/Shelf";
import { getShelf, getShelves, getUser } from "@/firebase/firestore";
import { BooksList } from "@/app/components";
import FilterBar from "./FilterBar/FiliterBar";


export default function Page({ params }: { params: { userId: string, shelfId: string }}) {
    const { user, setUser } = useContext(UserContext);
    const [createdByUser, setCreatedByUser] = useState<{ username: string, profileImage: string, email: string } | null>(null);
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            if (!user || !user.userId || !user.shelves) {
                // console.log('fetching user');
                setIsPageLoading(true);
                const shelves = await getShelves(params.userId);
                if (shelves === null) {
                    router.push('/login');
                    return;
                }
                setUser({
                    userId: params.userId,
                    shelves
                });
            }
        }

        const fetchShelf = async () => {
            if (!shelf) {
                // console.log('fetching shelf');
                setIsPageLoading(true);
                const shelf = await getShelf(params.shelfId);
                if (!shelf) {
                    // route to not found if shelf is null
                    router.push('/not-found');
                    return;
                }

                setShelf(shelf);
                setCreatedByUser(await getUser(shelf.createdBy));
            }
        }

        fetchUser();
        fetchShelf();
        setIsPageLoading(false);
    }, [user]);

    function Header() {
        return (
            <div className="w-full h-auto flex flex-row items-center justify-between p-7">
                <div className="flex flex-col h-full w-auto justify-evenly">
                    <h1 className='font-medium text-4xl max-w-[500px] truncate'>{shelf?.name || 'NAME'}</h1>
                    <h2 className="italic font-light max-w-[500px] truncate">{shelf?.description || 'DESCRIPTION'}</h2>
                </div>
                <div className="flex flex-row">
                    <p className="mr-2">Created By: {createdByUser?.username || 'CREATEDBY'}</p>
                    <p>IMAGE</p>
                </div>
            </div>
        )

    }

    if (isPageLoading || shelf === null) {
        return (
            <div className="w-screen h-screen flex flex-row items-center justify-center">
                <Spinner size="lg" label="Loading..."/>
            </div>
        )
    }
    return (
        <div className="w-screen h-screen">
            <Header />
            <FilterBar shelf={shelf} setShelf={setShelf} isLoading={isBooksLoading} setIsLoading={setIsBooksLoading}  />
            <BooksList shelf={shelf} books={shelf.shownBooks} />
        </div>
    )
}