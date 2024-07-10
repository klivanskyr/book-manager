'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@nextui-org/react";

import { Book, Shelf } from "@/types";
import { getShelf, removeBookFromShelf, updateBookOnUserShelf } from "@/firebase/firestore";
import { BooksList } from "@/components";
import FilterBar from "./FilterBar/FiliterBar";
import { BookSelect } from "@/components";


export default function Page({ params }: { params: { userId: string, shelfId: string }}) {
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(true);
    const [bookSelectActive, setBookSelectActive] = useState<boolean>(false);
    const router = useRouter();

    const ownerPermission = shelf?.createdById === params.userId;

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

    const handleRemoveBook = async (book: Book) => {
        if (!shelf) return;
        setIsBooksLoading(true);
        //This might get really slow as the database grows
        const error = await removeBookFromShelf(params.userId, params.shelfId, book.bookId);
        if (error) {
            console.error('Error removing book from shelf', error);
            return;
        }
        
        const newBooks = shelf.books.filter((b) => b.bookId !== book.bookId);
        const newShelf = { ...shelf, books: newBooks, shownBooks: newBooks };
        setShelf(newShelf);
        setIsBooksLoading(false);
    }

    const handleUpdateShelf = async (newBook: Book) => {
        if (!shelf) return;
        const oldShelf = shelf;

        // client side update
        const newBooks = shelf.books.map((book) => book.bookId === newBook.bookId ? newBook : book);
        const newShelf = { ...shelf, books: newBooks, shownBooks: newBooks };
        setShelf(newShelf);

        // server side update
        const error = await updateBookOnUserShelf(params.userId, params.shelfId, newBook);
        if (error) {
            console.error('Error updating book', error);
            setShelf(oldShelf); //revert changes
            return;
        }
    }

    function Header() {
        return (
            <div className="w-full h-auto flex flex-row items-center justify-between p-7">
                <div className="flex flex-col h-full w-auto justify-evenly">
                    <h1 className='font-medium text-4xl max-w-[500px] truncate'>{shelf?.name || "Title"}</h1>
                    <h2 className="italic font-light max-w-[500px] truncate">{shelf?.description || "Description"}</h2>
                </div>
                <div className="flex flex-col items-end justify-centerm mx-0.5">
                    <div className="flex flex-row">
                        {ownerPermission && <Button className='bg-blue-600 text-white shadow-medium mx-1' onClick={() => setBookSelectActive(true)}>Add Book</Button>}
                        <Button className='bg-white text-black border border-gray-200 shadow-medium' onClick={() => router.push(`/dashboard/${params.userId}`)}>Go To Dashboard</Button>
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
            <BookSelect active={bookSelectActive} setActive={setBookSelectActive} userId={params.userId} fetchShelves={fetchShelf} shelves={[shelf]} />
            {isBooksLoading 
            ? <div className="flex flex-row justify-center items-center w-full h-full"><Spinner size="lg"/></div> 
            : <BooksList handleRemoveBook={handleRemoveBook} handleUpdateShelf={handleUpdateShelf} ownerPermission={ownerPermission} shelf={shelf} books={shelf.shownBooks} />}
        </div>
    )
}