'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

import { Shelf } from "@/app/types/Shelf";
import { getShelf } from "@/firebase/firestore";
import { BooksList } from "@/app/components";
import FilterBar from "./FilterBar/FiliterBar";


export default function Page({ params }: { params: { userId: string, shelfId: string }}) {
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(true);
    const router = useRouter();

    const fetchShelf = async (shelfId: string) => {
        setIsPageLoading(true);
        const shelf = await getShelf(shelfId);
        if (!shelf) {
            console.error('No shelves found');
            return;
        }
        setShelf(shelf);
    }

    useEffect(() => {
        fetchShelf(params.shelfId);
        setIsPageLoading(false);
    }, []);

    function Header() {
        return (
            <div className="w-full h-auto flex flex-row items-center justify-between p-7">
                <div className="flex flex-col h-full w-auto justify-evenly">
                    <h1 className='font-medium text-4xl max-w-[500px] truncate'>{shelf?.name || "Title"}</h1>
                    <h2 className="italic font-light max-w-[500px] truncate">{shelf?.description || "Description"}</h2>
                </div>
                <div className="flex flex-row">
                    <p className="mr-2">Created By: {shelf?.createdBy || "Username"}</p>
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