'use client';

import { useState, useEffect, useRef } from "react";
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";

import { TextInput, ActionButton, ModalElement } from "@/components"
import { queryOpenLibrary } from "@/utils/openlibrary";
import { Book } from "@/types/Book";
import BookSelectCard from "./BookSelectCard";
import { Shelf } from "@/types/Shelf";
import { addBooktoUserShelves } from "@/firebase/firestore";


export default function BookSelect({ shelves, fetchShelves, userId, active, setActive }: { shelves: Shelf[], fetchShelves: Function, userId: string, active: boolean, setActive: Function }) {
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [foundBooks, setFoundBooks] = useState<Book[]>([]);
    const [selectedShelves, setSelectedShelves] = useState<Shelf[]>(shelves.length === 1 ? [shelves[0]] : []); // Default to first shelf if only one exists

    const handleClick = async () => {
        setSubmitted(true);
        setIsLoading(true);
        if (text === '') { 
            setIsLoading(false);
            return;
        }

        const res = await queryOpenLibrary(text);
        const data = await res.json();

        if (data.code !== 200) {
            setError(data.message);
            setIsLoading(false);
            return;
        }

        /*
            Loop through books pulled from API
            for every book, loop through user.shelves and check for matches.
            Set selected accordingly and let selected control disable of select button
        */
        const updatedBooks = data.books.map((apiBook: Book) => {
            const isBookInASelectedShelf = selectedShelves.some((shelf) => shelf.books.some((book) => book.key === apiBook.key));
            if (isBookInASelectedShelf) {
                return { ...apiBook, selected: true };
            }
            return apiBook;
        });
        
        setFoundBooks(updatedBooks);
        setIsLoading(false);
        setText('');
    }

    /** 
     * Adds a book to a user as well as changes it's 
     * selected field to true so its select button will be red in the modal
    */
    const addBook = async (newBook: Book) => {
        const updatedBook = { ...newBook, selected: true, bgColor: {r: 0, g: 0, b: 0}};

        const updatedBooks = foundBooks.map((book) => book.key === updatedBook.key ? updatedBook : book);
        setFoundBooks(updatedBooks); // Make select button red
        await addBooktoUserShelves(updatedBook, userId, selectedShelves.map((shelf) => shelf.shelfId));
        await fetchShelves(userId);
    }

    function updatedSelectedKeys(selectedIds: string[]) {
        let newSelectedShelves: Shelf[] = [];
        selectedIds.map((selectedId) => {
            const shelf = shelves.find((shelf) => shelf.shelfId === selectedId);
            if (shelf) {
                newSelectedShelves.push(shelf);
            }
        })
        setSelectedShelves(newSelectedShelves);
    }

    // Header contains search bar, submit button and selected shelves button
    function Header() {
        return (
            <div className='w-full flex flex-col lg:flex-row justify-between items-center'>
                <form className="flex lg:w-1/2 mb-1" onSubmit={(e) => e.preventDefault()}>
                    <TextInput className='w-full h-full rounded-l-lg rounded-r-none rounded-t-lg rounded-b-lg' radius='sm' label='' value={text} setValue={setText} error={error} />
                    {selectedShelves.length === 0 
                        ? <ActionButton className="rounded-md shadow-small bg-blue-400 text-sm lg:text-base" text='Submit' onClick={() => {}} disabled={true} />
                        : <ActionButton className="rounded-md shadow-small bg-blue-600 text-sm lg:text-base" text='Submit' onClick={handleClick} disabled={isLoading} />
                    }
                </form>
                <div className='w-full lg:w-1/2 flex flex-row justify-center lg:justify-between items-center ml-2'>
                    {shelves.length > 1 && 
                        <>
                            <div className='hidden lg:flex lg:flex-row'>
                                {selectedShelves.map((shelf) => (
                                    <Chip key={shelf.shelfId} onClose={() => setSelectedShelves(selectedShelves.filter((selectedShelf) => shelf.shelfId !== selectedShelf.shelfId))}>{shelf.name}</Chip>
                                ))}
                            </div>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button color='primary' className='w-[150px] m-1 mb-0 h-12 rounded-lg shadow-small bg-blue-600 text-wrap text-xs lg:text-medium text-white'>Select Shelves</Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    variant="flat"
                                    closeOnSelect={false}
                                    selectionMode="multiple"
                                    selectedKeys={selectedShelves.map((shelf) => shelf.shelfId)}
                                    onSelectionChange={(keys) => updatedSelectedKeys(Array.from(keys) as string[])}
                                >
                                    {shelves.map((shelf) => (
                                        <DropdownItem key={shelf.shelfId}>{shelf.name}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </>
                    }
                </div>
            </div>
        )
    }

    //Body is grid of books cards
    function Body() {
        if (!submitted) {
            return (<></>)
        } else if (isLoading) {
            return (
                <div className="w-full h-screen flex flex-row justify-center items-center">
                    <Spinner size="lg" label="Loading..." color='primary' />
                </div>
            )
        } else {
            return (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {foundBooks.map((book: Book) => <BookSelectCard key={book.key} book={book} addBook={addBook} />)}
                </div>
            )
        }
    }

    //Close button
    function Footer() {
        return (
            <ActionButton className='bg-blue-600 rounded-full' text='Close' onClick={() => setActive(false)} />
        )
    }

    return (
        <ModalElement 
            classNames={{ 
                base: "min-h-[90%] lg:min-h-[500px]",
                body: "lg:min-h-[500px]",
                header: "shadow-small",
                footer: "shadow-small",
                closeButton: 'hidden'
            }}
            placement="bottom-center"
            size='5xl'
            active={active} 
            Header={Header()} 
            Body={Body()} 
            Footer={Footer()} 
        />
    )
}