'use client';

import { useState } from "react";
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";

import { TextInput, ActionButton, ModalElement } from "@/app/components"
import { queryOpenLibrary } from "@/app/utils/openlibrary";
import { Book } from "@/app/types/Book";
import BookSelectCard from "./BookSelectCard";
import { Shelf } from "@/app/types/Shelf";
import { addBookToUserShelf, addBooktoUserShelves } from "@/firebase/firestore";
import { fetchDominantColor } from "@/app/utils/color";


export default function BookSelect({ shelves, fetchShelves, userId, active, setActive }: { shelves: Shelf[], fetchShelves: Function, userId: string, active: boolean, setActive: Function }) {
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [foundBooks, setFoundBooks] = useState<Book[]>([]);
    const [selectedShelves, setSelectedShelves] = useState<Shelf[]>([]);

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
                return apiBook.selected = true;
            }
            return apiBook;
        });
        
        setFoundBooks(updatedBooks);
        setIsLoading(false);
        setText('');
    }

    /** Adds a book to a user as well as changes it's 
     * selected field to true so its select button will be red in the modal */
    const addBook = async (newBook: Book) => {
        const [r, g, b] = await fetchDominantColor(newBook.coverUrl);
        const updatedBook = { ...newBook, selected: true, bgColor: {r: Math.min(r+50, 255), g: Math.min(g+50, 255), b: Math.min(b+50, 255)}};

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
            <div className='w-full flex flex-row justify-between items-center'>
                <form className="flex w-1/2" onSubmit={undefined}>
                    <TextInput className='w-full h-16 bg-slate-100 rounded-l-lg rounded-r-none rounded-t-lg rounded-b-lg shadow-small' radius='sm' label='Search by Title, Author or ISBN' value={text} setValue={setText} error={error} />
                    {selectedShelves.length === 0 
                        ? <ActionButton className="w-8 h-16 rounded-md shadow-small bg-blue-400" text='Submit' onClick={() => {}} disabled={true} />
                        : <ActionButton className="w-8 h-16 rounded-md shadow-small bg-blue-600" text='Submit' onClick={handleClick} disabled={isLoading} />
                    }
                </form>
                <div className='w-1/2 flex flex-row justify-between items-center ml-2'>
                    <div className='flex flex-row'>
                        {selectedShelves.map((shelf) => (
                            <Chip key={shelf.shelfId} onClose={() => setSelectedShelves(selectedShelves.filter((selectedShelf) => shelf.shelfId !== selectedShelf.shelfId))}>{shelf.name}</Chip>
                        ))}
                    </div>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button color='primary' className='w-[150px] h-12 rounded-lg shadow-small bg-blue-600 text-white text-medium'>Select Shelves</Button>
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
                base: "y-10",
                body: "min-h-[500px]",
                header: "shadow-small",
                footer: "shadow-small",
                closeButton: 'hidden'
            }}
            size='5xl'
            active={active} 
            Header={Header()} 
            Body={Body()} 
            Footer={Footer()} 
        />
    )
}