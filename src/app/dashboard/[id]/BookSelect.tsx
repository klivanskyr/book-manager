'use client';

import { useState, useContext } from "react";
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";

import { TextInput, ActionButton, ModalElement } from "@/app/components"
import { queryOpenLibrary } from "@/app/utils/openlibrary";
import { Book } from "@/app/types/Book";
import BookSelectCard from "./BookSelectCard";
import { UserContext } from "@/app/types/UserContext";
import { Shelf } from "@/app/types/Shelf";


export default function BookSelect({ active, setActive }: { active: boolean, setActive: Function }) {
    const { user, setUser } = useContext(UserContext);
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [foundBooks, setFoundBooks] = useState<Book[]>([]);
    const [selectedShelves, setSelectedShelves] = useState<{ shelfId: string, shelfName: string}[]>([]);

    const getNewBooks = async () => {
        if (!user) { return }
        const res = await queryOpenLibrary(text);
        const data = await res.json();
        if (data.code !== 200) {
            setError(data.message);
            setIsLoading(false);
            return [];
        }
        /*
            Loop through books pulled from API
            for every book, loop through user.shelves and check for matches.
            If all shelves have the book, then show remove button
            If no/some shelves have the book, show add button. Add book to all shelves selected,
            if a shelf is selected that already has the book in the some case, ignore readding it.

        */
        data.books.map((apiBook: Book) => {
            const activeShelves = user?.shelves.filter((shelf) => selectedShelves.includes(shelf.shelfId)); //Check if the Ids match and if so include it in the search
            activeShelves.map((shelf: Shelf) => {
                if (shelf.books.some((shelfBook) => shelfBook.key === apiBook.key)) {
                    return { ...apiBook, selected: true }
                }
            })
        });
    }

    const handleClick = async () => {
        setSubmitted(true);
        setIsLoading(true);
        if (text === '') { return }
        await getNewBooks();
        setText('');
        setIsLoading(false);
    }

    function updateFoundBooks(updatedBook: Book) {
        const updatedBooks = foundBooks.map((book) => {
            if (book.key === updatedBook.key) {
                return updatedBook;
            } else {
                return book;
            }
        });
        setFoundBooks(updatedBooks);
    }

    function displayBooks() {
        if (foundBooks.length === 0 && submitted) {
            return (<></>)
        } else {
            return(
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {foundBooks.map((book: Book) => <BookSelectCard key={book.key} book={book} updateFoundBooks={updateFoundBooks}/>)}
                </div>
            )
        }
    }

    function updatedSelectedKeys(selectedIds: string[]) {
        let newSelectedShelves: { shelfId: string, shelfName: string}[] = [];
        selectedIds.map((selectedId) => {
            const shelf = user?.shelves.find((shelf) => shelf.shelfId === selectedId);
            if (shelf) {
                newSelectedShelves.push({ shelfId: shelf.shelfId, shelfName: shelf.name });
            }
        })
        setSelectedShelves(newSelectedShelves);
    }

    function Header() {
        if (!user || !user.shelves) { return (<></>) }
        const userShelves = user?.shelves;

        return (
            <div className='w-full flex flex-row justify-between items-center'>
                <form className="flex w-1/2" onSubmit={undefined}>
                    <TextInput className='w-full h-16 bg-slate-100 rounded-l-lg rounded-r-none rounded-t-lg rounded-b-lg shadow-small' radius='sm' label='Search by Title, Author or ISBN' value={text} setValue={setText} error={error} />
                    <ActionButton className="w-8 h-16 rounded-md shadow-small bg-blue-600" text='Submit' onClick={handleClick} disabled={isLoading} />
                </form>
                <div className='w-1/2 flex flex-row justify-between items-center ml-2'>
                    <div className='flex flex-row'>
                        {selectedShelves.map(({shelfId, shelfName}) => (
                            <Chip key={shelfId} onClose={() => setSelectedShelves(selectedShelves.filter((shelf) => shelfId !== shelf.shelfId))}>{shelfName}</Chip>
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
                            {userShelves.map((shelf) => (
                                <DropdownItem key={shelf.shelfId}>{shelf.name}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        )
    }

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
            return displayBooks();
        }
    }

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