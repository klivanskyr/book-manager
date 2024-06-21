'use client';

import { useState, useContext } from "react";
import { Spinner, Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";

import { TextInput, ActionButton, ModalElement } from "@/app/components"
import { queryOpenLibrary } from "@/app/utils/openlibrary";
import { Book } from "@/app/types/Book";
import { fetchDominantColor } from "@/app/utils/color";
import { UserContext } from "@/app/types/UserContext";
import { addBookToUser, removeBookFromUser } from "@/app/db";
import { coverPlaceholder } from "@/assets";


export default function BookSelect({ active, setActive }: { active: boolean, setActive: Function }) {
    const { user, setUser } = useContext(UserContext);
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [foundBooks, setFoundBooks] = useState<Book[]>([]);

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
            const currentBook = foundBooks.find(curBook => curBook.key == book.key);
            return currentBook ? currentBook : book;
        });

        setFoundBooks(books);
    }

    //handle selecting book from modal
    const handleClickAdd = async (i: number): Promise<void> => {
        console.log('adding book', foundBooks[i])
        const [r, g, b] = await fetchDominantColor(foundBooks[i].coverImage);
        const updatedBook = { ...foundBooks[i], selected: true, bgColor: {r: Math.min(r+75, 255), g: Math.min(g+75, 255), b: Math.min(b+75, 255)}};
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        if (user) {
            await addBookToUser(updatedBook, user.user_id);
        } 
    }

    //handle removing book from modal
    const handleClickRemove = async (i: number): Promise<void>  => {
        const updatedBook = { ...foundBooks[i], selected: false };
        setFoundBooks(foundBooks.map((book, index) => index === i ? updatedBook : book));
        if (user) { //IF STATEMENT ON USER
            //Find book in user books where it will have an id.
            const userBookRef = user.books.find((book) => book.key === foundBooks[i].key);
            if (!userBookRef) { return; } //Not possible to remove book that is not in user books
            await removeBookFromUser(userBookRef.id, user.user_id)
        };
    }

    const handleClick = async () => {
        setSubmitted(true);
        setIsLoading(true);
        if (text === '') { return }
        await getNewBooks();
        setIsLoading(false);
    }

    function displayBooks() {
        if (foundBooks.length === 0 && submitted) {
            return (
                <div className='flex justify-center'>
                    <p>No books found</p>
                </div>
            )
        } else {
            return(
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {foundBooks.map((book: Book, i) => {
                        return (
                            <Card key={book.id} className="m-2">
                                <CardHeader className="flex justify-center mt-4">
                                    <Image
                                        alt="Book Cover"
                                        className=''
                                        src={book.coverImage}
                                        fallbackSrc={coverPlaceholder.src}
                                        height={150}
                                        width={150}
                                    />
                                </CardHeader>
                                <CardBody className="text-center flex flex-col justify-center mt-2">
                                    <h1 className="text-lg font-medium">{book.title}</h1>
                                    <h2 className="text-lg"> {book.author}</h2>
                                </CardBody>
                                <CardFooter className="flex justify-center my-4">
                                    {book.selected
                                        ? <ActionButton className='bg-red-600' text='Remove' onClick={() => handleClickAdd(i)} />
                                        : <ActionButton className='bg-blue-600' text='Select' onClick={() => handleClickRemove(i)} />
                                    }
                                </CardFooter>
                            </Card>
                        )})
                    }
                </div>
            )
        }
    }

    function Header() {
        return (
            <form className="flex w-full" onSubmit={undefined}>
                <TextInput className='w-full h-16 bg-slate-100 rounded-l-lg rounded-r-none rounded-t-lg rounded-b-lg shadow-small' radius='sm' label='Search by ISBN' value={text} setValue={setText} />
                <ActionButton className="w-8 h-16 rounded-l-none rounded-t-lg rounded-r-lg rounded-b-lg shadow-small bg-blue-600" text='Submit' onClick={handleClick} disabled={isLoading} />
            </form>
        )
    }

    function Body() {
        if (text === '' || !submitted) {
            return (<></>)
        } else if (isLoading) {
            return (
                <Spinner size="lg" label="Loading..." color='primary' />
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