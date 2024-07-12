'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Spinner } from "@nextui-org/react";

import { Shelf } from "@/types";
import { getShelf } from "@/firebase/firestore";
import { BooksList, FilterBar } from "@/components";

export default function Page({ params }: { params: { shelfId: string }}) {
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(true);
    const router = useRouter();

    const searchParams = useSearchParams();
    const userId = searchParams.get('userId')

    const fetchShelf = async () => {
        setIsBooksLoading(true);
        const shelf = await getShelf(params.shelfId);
        if (!shelf) {
            console.error('No shelves found', shelf, params);
            return;
        }
        setShelf(shelf);
        setIsBooksLoading(false);
    }

    useEffect(() => {
        fetchShelf();
    }, []);

    function Header() {
        return (
            <div className="w-full h-auto flex flex-row items-center justify-between p-7">
                <div className="flex flex-col h-full w-auto justify-evenly">
                    <h1 className='font-medium text-4xl max-w-[500px] truncate'>{shelf?.name || "Title"}</h1>
                    <h2 className="italic font-light max-w-[500px] truncate">{shelf?.description || "Description"}</h2>
                </div>
                <div className="flex flex-col items-end justify-centerm mx-0.5">
                    <div className="flex flex-row">
                        <Button className='mx-1 bg-white text-black border border-gray-200 shadow-medium' onClick={() => router.push(userId ? `/explore/${userId}` : `/explore`)}>Go To Dashboard</Button>
                    </div>
                    <div className="flex flex-row mt-2">
                        <p className="mr-8">Created By: {shelf?.createdByName || "Username"}</p>
                        <p className="mr-2">IMAGE</p>
                    </div>
                </div>
            </div>
        )

    }

    if (shelf === null) {
        return (
            <div className="w-screen h-screen flex flex-row items-center justify-center">
                <Spinner size="lg" label="Loading..."/>
            </div>
        )
    }
    return (
        <div className="w-screen">
            <Header />
            <FilterBar shelf={shelf} setShelf={setShelf} isLoading={isBooksLoading} setIsLoading={setIsBooksLoading}  />
            {isBooksLoading 
            ? <div className="flex flex-row justify-center items-center w-full h-full"><Spinner size="lg"/></div> 
            : <BooksList shelf={shelf} books={shelf.shownBooks} />}
        </div>
    )
}