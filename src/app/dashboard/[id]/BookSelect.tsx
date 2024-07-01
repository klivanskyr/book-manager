'use client';

import { useState, useEffect, useContext } from "react";
import { Spinner } from "@nextui-org/react";

import { TextInput, ActionButton, ModalElement } from "@/app/components"
import { queryOpenLibrary } from "@/app/utils/openlibrary";
import { Book } from "@/app/types/Book";
import BookSelectCard from "./BookSelectCard";
import { UserContext } from "@/app/types/UserContext";


export default function BookSelect({ active, setActive }: { active: boolean, setActive: Function }) {
    const { user, setUser } = useContext(UserContext);
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [foundBooks, setFoundBooks] = useState<Book[]>([]);

    //When user begins to write in search bar, clear error message
    useEffect(() => {
        if (text) {
            setError('');
        }
    }, [text])

    const getNewBooks = async () => {
        const res = await queryOpenLibrary(text);
        const data = await res.json();
        if (data.code !== 200) {
            setError(data.message);
            setIsLoading(false);
            return [];
        }
        /* 
            Loops through books pulled from API
            for every pulled book, loop through currentBooks and see if
            there is a match. If so replace the pulled book with the
            current book so the reviews and rating is preserved
        */
        const books = data.books.map((book: Book) => {
            const currentBook = user?.books?.find(curBook => curBook.key == book.key);
            console.log('found', currentBook)
            return { ...book, selected: currentBook?.selected || false}
        });

        setFoundBooks(books);
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
                    {foundBooks.map((book: Book, i) => <BookSelectCard key={book.key} book={book} updateFoundBooks={updateFoundBooks}/>)}
                </div>
            )
        }
    }

    function Header() {
        return (
            <form className="flex w-full" onSubmit={undefined}>
                <TextInput className='w-full h-16 bg-slate-100 rounded-l-lg rounded-r-none rounded-t-lg rounded-b-lg shadow-small' radius='sm' label='Search by Title, Author or ISBN' value={text} setValue={setText} error={error} />
                <ActionButton className="w-8 h-16 rounded-l-none rounded-t-lg rounded-r-lg rounded-b-lg shadow-small bg-blue-600" text='Submit' onClick={handleClick} disabled={isLoading} />
            </form>
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